using System;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SingalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        public readonly PresenceTracker _presenceTracker;
        public PresenceHub(PresenceTracker presenceTracker)
        {
            _presenceTracker = presenceTracker;
        }

        public async override Task OnConnectedAsync()
        {
            await Clients.Others.SendAsync("UserIsLogged", Context.User.GetUsername());
            await _presenceTracker.AddUser(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.All.SendAsync("GetOnlineUsers", _presenceTracker.OnlineUsers.Keys);
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Others.SendAsync("UserIsLogout", Context.User.GetUsername());
            await _presenceTracker.RemoveUser(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.All.SendAsync("GetOnlineUsers", _presenceTracker.OnlineUsers.Keys);

            await base.OnDisconnectedAsync(exception);
        }
    }
}