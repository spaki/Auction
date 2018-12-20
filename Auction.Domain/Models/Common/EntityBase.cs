using System;

namespace Auction.Domain.Models.Common
{
    public abstract class EntityBase
    {
        public Guid Id { get; set; }
    }
}
