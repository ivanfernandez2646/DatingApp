using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public string CreateToken(AppUser user)
        {
            //Reclamos
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
            };

            foreach (var roleName in user.UserRoles.
                Select(ur => ur.Role.Name.ToLower()))
            {
                claims.Add(new Claim(ClaimTypes.Role, roleName));
            }
            
            //Credenciales
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            //Creamos el token descriptor, con subject, fecha de expiración y las credenciales
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = creds
            };

            //Manejador de tokens
            var tokenHandler = new JwtSecurityTokenHandler();

            //Creamos el token, haciendo uso del manejador
            var token = tokenHandler.CreateToken(tokenDescriptor);

            //Lo serializamos a string y lo devolvemos
            return tokenHandler.WriteToken(token);
        }
    }
}