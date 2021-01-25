using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

namespace API.Data
{
    /* IdentityDbContext<TUser, TRole, TKey, IdentityUserClaim<TKey>, IdentityUserRole<TKey>, 
    IdentityUserLogin<TKey>, IdentityRoleClaim<TKey>, IdentityUserToken<TKey>*/
    public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, 
        AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                .HasMany(u => u.UserRoles)
                .WithOne(ur => ur.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            modelBuilder.Entity<AppRole>()
                .HasMany(r => r.UserRoles)
                .WithOne(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();

            modelBuilder.Entity<UserLike>()
                .HasKey(ul => new {ul.SourceUserId, ul.LikedUserId});

            modelBuilder.Entity<UserLike>()
                .HasOne(ul => ul.SourceUser)
                .WithMany(u => u.LikedUsers)
                .HasForeignKey(ul => ul.SourceUserId);

            modelBuilder.Entity<UserLike>()
                .HasOne(ul => ul.LikedUser)
                .WithMany(u => u.LikedByUsers)
                .HasForeignKey(ul => ul.LikedUserId);
            
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(a => a.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Recipient)
                .WithMany(a => a.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}