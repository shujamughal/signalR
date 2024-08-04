using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace Lecture_2_SignalRUserSpecificChat.Hubs
{

  
        public class ChatHub : Hub
        {
            private static ConcurrentDictionary<string, string> Users = new ConcurrentDictionary<string, string>();

            public async Task Register(string username)
            {
                Users[Context.ConnectionId] = username;
                await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessage", "System", $"You are registered as {username}");
            }

            public async Task SendMessageToUser(string targetUser, string message)
            {
                var senderUsername = Users[Context.ConnectionId];
                var connectionId = Users.FirstOrDefault(u => u.Value == targetUser).Key;
                if (connectionId != null)
                {
                    await Clients.Client(connectionId).SendAsync("ReceiveMessage", senderUsername, message);
                }
            }

            public override async Task OnDisconnectedAsync(Exception exception)
            {
                Users.TryRemove(Context.ConnectionId, out _);
                await base.OnDisconnectedAsync(exception);
            }
        }
    



}
