using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(ITokenService tokenService,
            IMapper mapper, UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginRegisterUserOutputDTO>> Register(RegisterUserDTO registerUser)
        {
            if (await ExistsUser(registerUser.UserName)) return BadRequest("Username has been already used");

            AppUser appUser = _mapper.Map<AppUser>(registerUser);
            appUser.UserName = registerUser.UserName.ToLower();

            var result = await _userManager.CreateAsync(appUser, registerUser.Password);
            if (!result.Succeeded) return BadRequest("An error occurred creating the user");

            await _userManager.AddToRoleAsync(appUser, "member");

            return new LoginRegisterUserOutputDTO
            {
                UserName = appUser.UserName,
                Token = _tokenService.CreateToken(appUser),
                KnownAs = appUser.KnownAs,
                Gender = appUser.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginRegisterUserOutputDTO>> Login(LoginUserDTO loginUser)
        {
            AppUser appUser = await _userManager.Users
                .Include(user => user.Photos)
                .Include(user => user.UserRoles).ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(user => user.UserName == loginUser.UserName.ToLower());

            if (appUser == null)
                return Unauthorized("User doesn't exist!!");

            var result = await _signInManager.CheckPasswordSignInAsync(appUser, loginUser.Password, false);
            if (!result.Succeeded) return Unauthorized("Incorrect password!!");

            return new LoginRegisterUserOutputDTO
            {
                UserName = appUser.UserName,
                Token = _tokenService.CreateToken(appUser),
                PhotoUrl = appUser.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = appUser.KnownAs,
                Gender = appUser.Gender
            };
        }

        private async Task<bool> ExistsUser(string username)
        {
            return await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower());
        }
    }
}