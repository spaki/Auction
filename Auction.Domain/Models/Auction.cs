using Auction.Domain.Enums;
using Auction.Domain.Exceptions;
using Auction.Domain.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;

namespace Auction.Domain.Models
{
    public class Auction : EntityBase
    {
        private object lockFlag = new object();
        private Timer startTimer;
        private Timer availableTimer;

        public string Title { get; set; }
        public DateTime Start { get; set; }
        public DateTime Available { get; set; }
        public DateTime? Ended { get; set; }
        public List<AuctionProduct> AuctionProducts { get; set; } = new List<AuctionProduct>();

        public AuctionStatus Status
        {
            get
            {
                if (Ended.HasValue)
                    return AuctionStatus.Ended;

                var now = DateTime.UtcNow;

                if (now > Start)
                    return AuctionStatus.Running;

                if (now > Available)
                    return AuctionStatus.NotStartedVisible;

                return AuctionStatus.NotStartedInvisible;
            }
        }

        public int LeftTimeToStartInMilliseconds
        {
            get
            {
                if (new [] { AuctionStatus.Ended, AuctionStatus.Running }.Contains(Status))
                    return 0;

                var result = Start - DateTime.UtcNow;

                return (int)result.TotalMilliseconds;
            }
        }

        public int LeftTimeToBeAvailableInMilliseconds
        {
            get
            {
                if (new[] { AuctionStatus.Ended, AuctionStatus.Running, AuctionStatus.NotStartedVisible }.Contains(Status))
                    return 0;

                var result = Available - DateTime.UtcNow;

                return (int)result.TotalMilliseconds;
            }
        }

        public delegate void AuctionHandler(Auction auction);
        public event AuctionHandler OnStart;
        public event AuctionHandler OnAvailable;
        public event AuctionHandler OnEnd;

        public void Begin()
        {
            lock (lockFlag)
            {
                AuctionProducts = AuctionProducts.OrderBy(e => e.Sequence).ToList();
                AuctionProducts.ForEach(e =>
                {
                    e.OnEnd += Swap;
                    e.Auction = this;
                });

                startTimer = new Timer((Start - DateTime.UtcNow).TotalMilliseconds) { AutoReset = false };
                startTimer.Elapsed += StartTimer_Elapsed;

                availableTimer = new Timer((Available - DateTime.UtcNow).TotalMilliseconds) { AutoReset = false };
                availableTimer.Elapsed += AvailableTimer_Elapsed;

                startTimer.Start();
                availableTimer.Start();
            }
        }

        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(Title))
                throw new DomainException("Invalid Title");

            var now = DateTime.UtcNow;
            var safetyMargin = now.AddMinutes(1);

            if (Start < now.AddMinutes(1))
                throw new DomainException("Start time should be greter than the current date time plus one minute.");

            if (Available < now.AddMinutes(1))
                throw new DomainException("Available preview time should be greter than the current date time plus one minute.");

            if (Start < Available.AddMinutes(1))
                throw new DomainException("Start time should be greter than the Available time plus one minute.");

            if(AuctionProducts.Count < 1)
                throw new DomainException("The Auction should have at least one product.");

            AuctionProducts.ForEach(e => e.Validate());

            if(AuctionProducts.GroupBy(e => e.Sequence).Any(e => e.Count() > 1))
                throw new DomainException("The Auction Product sequence should not be repeated.");
        }

        private void Swap(AuctionProduct auctionProduct)
        {
            lock (lockFlag)
            {
                var next = AuctionProducts.FirstOrDefault(e => e.Sequence > auctionProduct.Sequence);

                if (next != null)
                {
                    next.Start();
                    return;
                }

                Ended = DateTime.UtcNow;
                OnEnd?.Invoke(this);
            }
        }

        private void StartTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            OnStart?.Invoke(this);
            AuctionProducts.FirstOrDefault().Start();
        }

        private void AvailableTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            OnAvailable?.Invoke(this);
        }
    }
}
