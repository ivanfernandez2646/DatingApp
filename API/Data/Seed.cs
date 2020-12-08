using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            foreach(AppUser user in users){
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();
                user.PasswordHash = await hmac.ComputeHashAsync(new MemoryStream(Encoding.UTF8.GetBytes("123456")));
                user.PasswordSalt = hmac.Key;

                await context.AddAsync(user);
            }

            await context.SaveChangesAsync();
        }   
    }
}