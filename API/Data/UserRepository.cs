using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDTO> GetMemberByIdAsync(int id)
        {
            return await _context.Users
                .Where(x => x.Id == id)
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<MemberDTO> GetMemberByUsernameAsync(string username)
        {
            return await _context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();
        }

        public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams)
        {   
            //Omit default user
            var query = _context.Users
                .AsQueryable()
                .Where(u => u.UserName != userParams.CurrentUsername);

            //Filter Age
            var minimumDate = DateTime.Today.AddYears(-userParams.MaxAge -1);
            var maximumDate = DateTime.Today.AddYears(-userParams.MinAge);

            query = query
                .Where(u => u.DateOfBirth.Date >= minimumDate.Date
                            && u.DateOfBirth.Date <= maximumDate.Date);

            //Filter Gender
            if (userParams.Gender != null){
                query = query.Where(u => u.Gender == userParams.Gender);
            }

            //Order
            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            
            var source = query
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .AsNoTracking();

            return await PagedList<MemberDTO>.CreateAsync(source, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(x => x.Photos)
                
                .FirstOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }
        
        public void Update(AppUser appUser)
        {
            _context.Entry<AppUser>(appUser).State = EntityState.Modified;
        }
    }
}