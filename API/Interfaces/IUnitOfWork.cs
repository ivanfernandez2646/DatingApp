using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        ILikesRepository LikesRepository { get; }
        IMessageRepository MessageRepository { get; }

        bool HasChanges();
        Task<bool> SaveChangesAsync();
    }
}