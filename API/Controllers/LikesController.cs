using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly ILikesRepository _likesRepository;
        private readonly IUserRepository _userRepository;
        public LikesController(ILikesRepository likesRepository,
            IUserRepository userRepository)
        {
            _likesRepository = likesRepository;
            _userRepository = userRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var userIdSource = User.GetUserId();
            var sourceUser = await _likesRepository.GetUserWithLikes(userIdSource);
            var likedUser = await _userRepository.GetUserByUsernameAsync(username);

            if (sourceUser.UserName == username) return BadRequest("You can't like yourself");

            bool hasPreviousLike = (await _likesRepository.GetUserLike(sourceUser.Id, likedUser.Id) != null) 
                ? true : false;

            if (hasPreviousLike) return BadRequest("You already like this user");

            var userLike = new UserLike(){
                SourceUserId = sourceUser.Id,
                SourceUser = sourceUser,
                LikedUserId = likedUser.Id,
                LikedUser = likedUser
            };
            
            sourceUser.LikedUsers.Add(userLike);
            if(await _userRepository.SaveAllAsync())
                return Ok();
            
            return BadRequest("A problem occurred adding the like to the user");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LikeDTO>>> GetUserLikes([FromQuery] LikeParams likeParams)
        {
            var userId = User.GetUserId();
            var userLikes = await _likesRepository.GetUserLikes(likeParams, userId);
            Response.AddPaginationHeaders(userLikes.PageNumber, userLikes.TotalPages, userLikes.PageSize, userLikes.TotalCount);
            return Ok(userLikes);
        }
    }
}