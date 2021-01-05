using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository, IMapper mapper,
            IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetMembers([FromQuery]UserParams userParams)
        {
            var users = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeaders(users.PageNumber, users.TotalPages, users.PageSize, users.TotalCount);
            var mappedUsers = _mapper.Map<IEnumerable<MemberDTO>>(users);
            
            return Ok(mappedUsers);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetMemberByUsername(string username)
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

            if (userToUpdate != null)
            {
                var updatedAppUser = _mapper.Map(memberUpdateDTO, userToUpdate);
                _userRepository.Update(updatedAppUser);
                if (await _userRepository.SaveAllAsync())
                    return Ok();
            }

            return BadRequest("An error with the update user process has been occurred");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> InsertPhoto(IFormFile img)
        {
            var username = User.Claims.FirstOrDefault()?.Value;
            var userToUpdate = await _userRepository.GetUserByUsernameAsync(username);

            if (userToUpdate != null)
            {
                var imageUploadResult = await _photoService.UploadPhotoToCloudinary(img);
                
                Photo photo = new Photo();

                photo.PublicId = imageUploadResult.PublicId;
                photo.Url = imageUploadResult.SecureUrl.ToString();
                
                if(userToUpdate.Photos.Count == 0)
                    photo.IsMain = true;

                userToUpdate.Photos.Add(photo);
                _userRepository.Update(userToUpdate);

                if(await _userRepository.SaveAllAsync()){
                    var photoDTO = _mapper.Map<PhotoDTO>(photo);
                    return Ok(photoDTO);
                }    
            }

            return BadRequest("An error with the saving of the image process has been occurred");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult<PhotoDTO>> SetMainPhoto(int photoId)
        {
            var username = User.Claims.FirstOrDefault()?.Value;
            var userToUpdate = await _userRepository.GetUserByUsernameAsync(username);

            if (userToUpdate != null)
            {
                Photo photo = userToUpdate.Photos.FirstOrDefault(x => x.IsMain);
                if(photo != null) photo.IsMain = false;
                Photo photoToUpdate = userToUpdate.Photos.FirstOrDefault(x => x.Id == photoId);
                photoToUpdate.IsMain = true;
                _userRepository.Update(userToUpdate);

                if(await _userRepository.SaveAllAsync()){
                    var photoDTO = _mapper.Map<PhotoDTO>(photoToUpdate);
                    return Ok(photoDTO);
                }    
            }

            return BadRequest("An error with the saving of the set main image process has been occurred");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var username = User.Claims.FirstOrDefault()?.Value;
            var userToUpdate = await _userRepository.GetUserByUsernameAsync(username);

            if (userToUpdate != null)
            {
                if(userToUpdate.Photos.FirstOrDefault(x => x.IsMain)?.Id == photoId)
                    return Unauthorized("Main photo can't be deleted. Please select another photo");

                var photoToDelete = userToUpdate.Photos.FirstOrDefault(x => x.Id == photoId);
                if (photoToDelete != null){
                    var resDelete = await _photoService.DeletePhotoFromCloudinary(photoToDelete.PublicId);
                    if (resDelete.DeletedCounts.Values.Count == 1)
                    {       
                        userToUpdate.Photos.Remove(photoToDelete);
                        _userRepository.Update(userToUpdate);

                        if(await _userRepository.SaveAllAsync()){
                            return Ok();
                        } 
                    }
                }                
            }

            return BadRequest("An error with the delete of the image process has been occurred");
        }
    }
}