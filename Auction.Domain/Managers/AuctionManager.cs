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
        private static List<AuctionProduct> AuctionProducts = new List<AuctionProduct>();
        private static object lockFlag = new object();

        public static void Add(AuctionProduct auctionProduct)
        {
            if (string.IsNullOrWhiteSpace(auctionProduct.Product?.Name))
                throw new DomainException("Invalid Product");

            if (auctionProduct.TimeoutInMilliseconds < 10000)
                throw new DomainException("Timeout should be greater than 10s");

            if (auctionProduct.TickIntervalInMilliseconds < 1000)
                throw new DomainException("Tick Interval should be greater than 1s");

            if (auctionProduct.StartValue < 1000)
                throw new DomainException("Start Value should be greater than 0.01");

            if (string.IsNullOrWhiteSpace(auctionProduct.Product?.Name))
                throw new DomainException("Invalid Product.");

            auctionProduct.Id = Guid.NewGuid();
            auctionProduct.Product.Id = Guid.NewGuid();

            lock (lockFlag)
            {
                AuctionProducts.Add(auctionProduct);
            }
        }

        public static void ClearEnded()
        {
            lock (lockFlag)
            {
                AuctionProducts.RemoveAll(e => e.Status == AuctionProductStatus.Ended);
            }
        }

        public static List<AuctionProduct> List() => AuctionProducts;

        public static AuctionProduct Get(Guid id)
        {
            var result = AuctionProducts.FirstOrDefault(e => e.Id == id);

            if (result == null)
                throw new DomainException("Auction for this product not found. Probably it has finished");

            return result;
        }
    }
}
