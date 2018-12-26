using System;

namespace Auction.Domain.Models
{
    public class ServerInfo
    {
        public DateTime CurrentUTCDateTime { get; set; }
        public DateTime CurrentDateTime { get; set; }
    }
}
