using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            var mappedUsers = _mapper.Map<IEnumerable<MemberDTO>>(users);
            
            return Ok(mappedUsers);
        }

        // [Authorize]
        // [HttpGet("{id}")]
        // public async Task<ActionResult<AppUser>> GetUser(int id)
        // {
        //     return await _userRepository.GetUserByIdAsync(id);
        // }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetUserByUsername(string username)
        {
            var user = await _userRepository.GetMemberByUsernameAsync(username);
            var mappedUser = _mapper.Map<MemberDTO>(user);

            return mappedUser;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var username = User.Claims.FirstOrDefault()?.Value;
            var userToUpdate = await _userRepository.GetUserByUsernameAsync(username);

            if(userToUpdate != null){
                var updatedAppUser = _mapper.Map(memberUpdateDTO, userToUpdate);
                _userRepository.Update(updatedAppUser);
                if(await _userRepository.SaveAllAsync())
                    return Ok();
            }

            return BadRequest("An error with the update user process");
        }
    }
}