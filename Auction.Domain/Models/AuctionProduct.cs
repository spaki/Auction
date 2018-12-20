using Auction.Domain.Enums;
using Auction.Domain.Exceptions;
using Auction.Domain.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;

namespace Auction.Domain.Models
{
    public class AuctionProduct : EntityBase
    {
        private object lockFlag = new object();
        private Timer timeoutTimer;
        private Timer tickTimer;

        public int Sequence { get; set; }
        public int TimeoutInMilliseconds { get; set; }
        public int TickIntervalInMilliseconds { get; set; }
        public Product Product { get; set; }
        public decimal StartValue { get; set; }
        public DateTime? Started { get; private set; }
        public DateTime? Ended { get; private set; }
        public List<Bid> Bids { get; private set; } = new List<Bid>();
        public Bid LastValidBid { get => Bids.OrderByDescending(e => e.DateTime).FirstOrDefault(e => e.DateTime <= Ended || Ended == null); }

        public AuctionProductStatus Status
        {
            get
            {
                if (Ended.HasValue)
                    return AuctionProductStatus.Ended;

                if (Started.HasValue)
                    return AuctionProductStatus.Running;

                return AuctionProductStatus.NotStarted;
            }
        }

        public int LeftTimeInMilliseconds
        {
            get
            {
                if (Ended.HasValue)
                    return 0;

                if (!Started.HasValue)
                    return TimeoutInMilliseconds;

                var lastBid = LastValidBid;

                if (lastBid != null)
                    return (int)(DateTime.UtcNow - lastBid.DateTime).TotalMilliseconds;

                return (int)(DateTime.UtcNow - Started.Value).TotalMilliseconds;
            }
        }

        public delegate void BidHandler(Bid bid);
        public event BidHandler OnBidOffered;

        public delegate void AuctionProductHandler(AuctionProduct auctionProduct);
        public event AuctionProductHandler OnStart;
        public event AuctionProductHandler OnEnd;
        public event AuctionProductHandler OnTick;

        public void AddBid(User user, decimal value)
        {
            lock (lockFlag)
            {
                if (value < StartValue || value <= LastValidBid?.Value)
                    throw new DomainException("Invalid Bid Value.");

                var bid = new Bid(user, value, this);
                CheckIfEnded();
                Bids.Add(bid);
                timeoutTimer.Interval = TimeoutInMilliseconds;
                OnBidOffered?.Invoke(bid);
            }
        }

        public void Start()
        {
            CheckIfEnded();
            Started = DateTime.UtcNow;
            OnStart?.Invoke(this);

            timeoutTimer = new Timer(TimeoutInMilliseconds) { AutoReset = false };
            timeoutTimer.Elapsed += End;

            tickTimer = new Timer(TickIntervalInMilliseconds) { AutoReset = true };
            tickTimer.Elapsed += Tick; 

            timeoutTimer.Start();
            tickTimer.Start();
        }

        private void Tick(object sender, ElapsedEventArgs e) => OnTick?.Invoke(this);

        private void End(object sender, ElapsedEventArgs e)
        {
            lock (lockFlag)
            {
                Ended = DateTime.UtcNow;

                timeoutTimer.Close();
                tickTimer.Close();
                timeoutTimer.Dispose();
                tickTimer.Dispose();

                OnEnd?.Invoke(this);
            }
        }

        private void CheckIfEnded()
        {
            if (Ended.HasValue)
                throw new DomainException("It was not possible to complete the operation. The Auction for this product ended already.");
        }
    }
}
