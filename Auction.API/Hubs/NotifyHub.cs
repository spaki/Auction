using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Auction.API.Hubs
{
    public class NotifyHub : Hub
    {
        public async Task JoinGroup(string groupName) => await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }
}
