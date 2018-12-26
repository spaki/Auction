using Auction.Domain.Enums;
using Auction.Domain.Exceptions;
using Auction.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Auction.Domain.Managers
{
    public class AuctionManager
    {
        private static List<Models.Auction> auctions = new List<Models.Auction>();
        private static object lockFlag = new object();

        public static void Add(Models.Auction auction)
        {
            auction.Validate();

            auction.Id = Guid.NewGuid();

            auction.AuctionProducts.ForEach(ap => {
                ap.Id = Guid.NewGuid();
                ap.Product.Id = Guid.NewGuid();
                ap.Product.Pictures.ForEach(pic => pic.Id = Guid.NewGuid());
            });

            lock (lockFlag)
            {
                auctions.Add(auction);
            }
        }

        public static void ClearEnded()
        {
            lock (lockFlag)
            {
                auctions.RemoveAll(e => e.Status == AuctionStatus.Ended);
            }
        }

        public static List<Models.Auction> ListAll() => auctions;

        public static List<Models.Auction> ListAvailables() => auctions.Where(e => new[] { AuctionStatus.NotStartedVisible, AuctionStatus.Running }.Contains(e.Status)).ToList();

        public static AuctionProduct GetAuctionProduct(Guid id)
        {
            lock (lockFlag)
            {
                var result = auctions.SelectMany(e => e.AuctionProducts).FirstOrDefault(e => e.Id == id);

                if (result == null)
                    throw new DomainException("Auction for this product not found. Probably it has finished");

                return result;
            }
        }

        public static Models.Auction GetAuction(Guid id)
        {
            lock (lockFlag)
            {
                var result = auctions.FirstOrDefault(e => e.Id == id);

                if (result == null)
                    throw new DomainException("Auction not found. Probably it has finished");

                return result;
            }
        }
    }
}
