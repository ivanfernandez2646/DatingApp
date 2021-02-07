using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.SingalR
{
    public class PresenceTracker
    {
        public Dictionary<string, List<string>> OnlineUsers { get; set; }

        public PresenceTracker()
        {
            OnlineUsers = new Dictionary<string, List<string>>();
        }

        public async Task AddUser(string username, string connectionId)
        {
            lock(OnlineUsers){
                if(OnlineUsers.ContainsKey(username)){
                    OnlineUsers[username].Add(connectionId);
                }else{
                    OnlineUsers.Add(username, new List<string>() {connectionId});
                }
            }

            await Task.CompletedTask;
        }

        public async Task RemoveUser(string username, string connectionId)
        {
            lock(OnlineUsers){
                if(OnlineUsers.ContainsKey(username)){
                    if(OnlineUsers[username] == null
                        || OnlineUsers[username].Count == 0){
                        OnlineUsers.Remove(username);
                    }else{
                        OnlineUsers[username].Remove(connectionId);

                        if(OnlineUsers[username].Count == 0){
                            OnlineUsers.Remove(username);
                        }
                    }
                }
            }

            await Task.CompletedTask;
        }

        public async Task<IEnumerable<string>> GetConnectionsIdForUser(string username)
        {
            var listOfConnectionsId = new List<string>();
            lock(OnlineUsers){
                if(OnlineUsers.ContainsKey(username)){
                    listOfConnectionsId = OnlineUsers[username];
                }
            }

            await Task.CompletedTask;
            return listOfConnectionsId;
        }
    }
}