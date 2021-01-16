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
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public LikesRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes
                .FindAsync(new object[] { sourceUserId, likedUserId });
        }

        public async Task<PagedList<LikeDTO>> GetUserLikes(LikeParams likeParams, int userId)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if (likeParams.Predicate == "likedBy")
            {
                likes = likes.Where(ul => ul.LikedUserId == userId);
                users = likes.Include(ul => ul.SourceUser.Photos).Select(ul => ul.SourceUser);
            }
            else if (likeParams.Predicate == "liked" || string.IsNullOrEmpty(likeParams.Predicate))
            {
                likes = likes.Where(ul => ul.SourceUserId == userId);
                users = likes.Include(ul => ul.LikedUser.Photos).Select(ul => ul.LikedUser);
            }

            var source = users
                .ProjectTo<LikeDTO>(_mapper.ConfigurationProvider)
                .AsNoTracking();
            
            return await PagedList<LikeDTO>
                .CreateAsync(source, likeParams.PageNumber, likeParams.PageSize);
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
                .Include(u => u.LikedUsers)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}