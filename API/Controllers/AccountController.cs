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
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(DataContext context, ITokenService tokenService,
            IMapper mapper) : base(context)
        {
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginRegisterUserOutputDTO>> Register(RegisterUserDTO registerUser)
        {
            if (await ExistsUser(registerUser.UserName)) return BadRequest("Username has been already used");

            using var hmac = new HMACSHA512();

            AppUser appUser = _mapper.Map<AppUser>(registerUser);

            appUser.UserName = registerUser.UserName.ToLower();
            appUser.PasswordHash = await hmac.ComputeHashAsync(new MemoryStream(Encoding.UTF8.GetBytes(registerUser.Password)));
            appUser.PasswordSalt = hmac.Key;

            _context.Add(appUser);
            await _context.SaveChangesAsync();

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
            AppUser appUser = await _context.Users
                .Include(user => user.Photos)
                .FirstOrDefaultAsync(user => user.UserName == loginUser.UserName.ToLower());

            if (appUser == null)
                return Unauthorized("User doesn't exist!!");

            using var hmac = new HMACSHA512(appUser.PasswordSalt);

            byte[] computedHash = await hmac.ComputeHashAsync(new MemoryStream(Encoding.UTF8.GetBytes(loginUser.Password)));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != appUser.PasswordHash[i]) return Unauthorized("Incorrect password!!");
            }

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
            return await _context.Users.AnyAsync(user => user.UserName == username.ToLower());
        }
    }
}