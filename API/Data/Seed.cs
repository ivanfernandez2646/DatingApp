using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, 
            RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            var roles = new List<AppRole>(){
                new AppRole() {Name = "admin"},
                new AppRole() {Name = "moderator"},
                new AppRole() {Name = "member"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            };
            
            foreach(AppUser user in users){
                user.UserName = user.UserName.ToLower();
                if ((await userManager.CreateAsync(user, "123456")).Succeeded) 
                    await userManager.AddToRoleAsync(user, "member");
            }

            var admin = new AppUser(){
                UserName = "admin"
            };

            var result = await userManager.CreateAsync(admin, "123456");
            if (result.Succeeded) await userManager.AddToRolesAsync(admin, roles.Select(r => r.Name));
        }   
    }
}