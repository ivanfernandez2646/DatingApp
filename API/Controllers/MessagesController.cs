using System.Collections.Generic;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MessagesController(IUnitOfWork unitOfWork,
             IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> AddMessage(CreateMessageDTO createMessageDTO)
        {
            var senderUsername = User.GetUsername();
            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(senderUsername);
            var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDTO.RecipientUsername);

            if (senderUsername == createMessageDTO.RecipientUsername) return BadRequest("You can't send a message to yourself");
            if (recipient == null) return NotFound();

            var message = new Message()
            {
                Sender = sender,
                SenderUsername = sender.UserName,
                Recipient = recipient,
                RecipientUsername = recipient.UserName,
                Content = createMessageDTO.Content
            };

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.SaveChangesAsync()) return Ok(_mapper.Map<MessageDTO>(message));

            return BadRequest("An error occurred sending the message");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDTO>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            if(!User.Identity.IsAuthenticated)
                return Unauthorized("You can't view messages unless you're authenticated");

            messageParams.UserName = User.GetUsername();
            messageParams.Container = messageParams.Container.ToLower();
            var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);
            Response.AddPaginationHeaders(messages.PageNumber, messages.TotalPages, 
                messages.PageSize, messages.TotalCount);

            return Ok(messages);
        }

        [HttpGet("thread/{recipientUsername}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessageThread(string recipientUsername)
        {
            string currentUsername = User.GetUsername();
            var messages = await _unitOfWork.MessageRepository.GetMessageThread(currentUsername, recipientUsername);
            return Ok(messages);
        }

        [HttpDelete]
        public async Task<ActionResult<PagedList<MessageDTO>>> DeleteMessage([FromQuery] MessageParams messageParams){
            if(!User.Identity.IsAuthenticated)
                return Unauthorized("You can't view messages unless you're authenticated");

            var message = await _unitOfWork.MessageRepository.GetMessage(messageParams.MessageId);
            if(message == null) return NotFound("Message not found");

            var userLogged = User.GetUsername();
            messageParams.UserName = userLogged;

            if(message.SenderUsername == userLogged 
                && !message.SenderDeleted){
                message.SenderDeleted = true;
            }
            else if(message.RecipientUsername == userLogged 
                && !message.RecipientDeleted)
            {
                message.RecipientDeleted = true;
            }

            if(message.SenderDeleted && message.RecipientDeleted)
                _unitOfWork.MessageRepository.DeleteMessage(message);

            if(await _unitOfWork.SaveChangesAsync()){
                var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);
                Response.AddPaginationHeaders(messages.PageNumber, messages.TotalPages, 
                messages.PageSize, messages.TotalCount);

                return Ok(messages);
            }

            return BadRequest("An error occurred deleting the message");
        }
    }
}