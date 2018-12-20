using Auction.Domain.Models.Common;
using System;

namespace Auction.Domain.Models
{
    public class Bid : EntityBase
    {
        public Bid(User user, decimal value, AuctionProduct auctionProduct)
        {
            this.User = user;
            this.Value = value;
            this.AuctionProduct = auctionProduct;
            DateTime = DateTime.UtcNow;
        }

        public decimal Value { get; private set; }
        public User User { get; private set; }
        public AuctionProduct AuctionProduct { get; private set; }
        public DateTime DateTime { get; private set; }
    }
}
