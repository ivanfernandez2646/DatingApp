using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        
        public AdminController(UserManager<AppUser> userManager, 
            RoleManager<AppRole> roleManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var userRoles = await _userManager.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new {
                    u.Id,
                    u.UserName,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name)
                }).ToListAsync();

            return Ok(userRoles);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPut("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles){
            
            var splittedRoles = roles.Split(",")
                .Select(r => r.Trim().ToLower())
                .ToList();

            var user = await _userManager.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserName == username.ToLower());

            if (user == null) return BadRequest("User not found");

            var userRoles = await _userManager.GetRolesAsync(user);
            
            var resUpdate = await _userManager.AddToRolesAsync(user, splittedRoles.Except(userRoles));
            if(!resUpdate.Succeeded) return BadRequest("An error occurred granted the roles");

            var resDelete = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(splittedRoles));
            if(!resDelete.Succeeded) return BadRequest("An error occurred removing the roles");

            return Ok(user.UserRoles.Select(ur => ur.Role.Name));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Only admin can access here 2");
        }
    }
}