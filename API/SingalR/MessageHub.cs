using System;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SingalR
{
    public class MessageHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _presenceTracker;

        public MessageHub(IUnitOfWork unitOfWork,
            IMapper mapper,
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker presenceTracker)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _presenceHub = presenceHub;
            _presenceTracker = presenceTracker;
        }

        public async override Task OnConnectedAsync()
        {
            var senderUsername = Context.User.GetUsername();
            var recipientUsername = Context.GetHttpContext().Request.Query["user"].ToString();
            string groupName = GetGroupName(senderUsername, recipientUsername);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddConnection(groupName, senderUsername);

            var messageThread =
                await _unitOfWork.MessageRepository.GetMessageThread(senderUsername, recipientUsername);

            await Clients.Group(groupName).SendAsync("GetMessageThread", messageThread);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            var senderUsername = Context.User.GetUsername();
            var recipientUsername = Context.GetHttpContext().Request.Query["user"].ToString();
            string groupName = GetGroupName(senderUsername, recipientUsername);
            await RemoveConnection(groupName);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task OnSendMessage(string content)
        {
            var senderUsername = Context.User.GetUsername();
            var recipientUsername = Context.GetHttpContext().Request.Query["user"].ToString();
            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(senderUsername);
            var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(recipientUsername);

            if (senderUsername == recipientUsername) throw new HubException("You can't send a message to yourself");
            if (recipient == null) throw new HubException("Recipient user not found");
            
            var groupName = GetGroupName(senderUsername, recipientUsername);

            var message = new Message()
            {
                Sender = sender,
                SenderUsername = sender.UserName,
                Recipient = recipient,
                RecipientUsername = recipient.UserName,
                Content = content
            };

            Group group = await _unitOfWork.MessageRepository.GetGroup(groupName);
            if(group != null){
                if(group.Connections.FirstOrDefault(c => c.Username == recipientUsername) != null){
                    message.DataRead = DateTime.UtcNow;
                }else{
                    var listOfRecipientConnections = 
                        await _presenceTracker.GetConnectionsIdForUser(recipientUsername);

                    await _presenceHub.Clients.Clients(listOfRecipientConnections)
                        .SendAsync("NewMessageReceived", new {
                            username =  sender.UserName, 
                            knownAs = sender.KnownAs
                        });
                }
            }

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.SaveChangesAsync())
            {
                var messageDTO = _mapper.Map<MessageDTO>(message);
                await Clients.Group(groupName).SendAsync("GetNewMessage", messageDTO);
            }
        }

        private string GetGroupName(string senderUsername, string recipientUsername)
        {
            if (String.Compare(senderUsername, recipientUsername) < 0)
            {
                return (senderUsername + recipientUsername).ToUpper();
            }
            else
            {
                return (recipientUsername + senderUsername).ToUpper();
            }
        }

        private async Task<bool> AddConnection(string groupName, string senderUsername)
        {
            var group = await _unitOfWork.MessageRepository.GetGroup(groupName);
            if(group == null){
                group = new Group(groupName);
                _unitOfWork.MessageRepository.AddGroup(group);
            }

            Connection connection = new Connection(Context.ConnectionId, senderUsername);
            group.Connections.Add(connection);

            return await _unitOfWork.SaveChangesAsync();
        }

        private async Task<bool> RemoveConnection(string groupName)
        {
            Group group = await _unitOfWork.MessageRepository.GetGroup(groupName);
            if (group != null){
                Connection connection = await _unitOfWork.MessageRepository.GetConnection(Context.ConnectionId);
                _unitOfWork.MessageRepository.RemoveConnection(connection);
            }

            return await _unitOfWork.SaveChangesAsync();
        }
    }
}