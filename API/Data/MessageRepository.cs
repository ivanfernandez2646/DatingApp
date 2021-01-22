using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context,
            IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(m => m.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "inbox" => query.Where(m => m.RecipientUsername == messageParams.UserName 
                    && !m.RecipientDeleted),
                "outbox" => query.Where(m => m.SenderUsername == messageParams.UserName
                    && !m.SenderDeleted),
                _ => query.Where(m => m.RecipientUsername == messageParams.UserName
                    && m.DataRead == null)
            };

            var source = query
                .ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDTO>.CreateAsync(source, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = _context.Messages
                .OrderBy(m => m.MessageSent)
                .Where(m => (m.SenderUsername == currentUsername && !m.SenderDeleted) && m.RecipientUsername == recipientUsername
                        || (m.RecipientUsername == currentUsername && !m.RecipientDeleted) && m.SenderUsername == recipientUsername)
                .AsQueryable();

            await messages.ForEachAsync(m => {
                if(m.DataRead == null && m.RecipientUsername == currentUsername)
                    m.DataRead = DateTime.Now;
            });

            await _context.SaveChangesAsync();
            var messagesDTOs = messages
                .ProjectTo<MessageDTO>(_mapper.ConfigurationProvider)
                .AsEnumerable();
            return messagesDTOs;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}