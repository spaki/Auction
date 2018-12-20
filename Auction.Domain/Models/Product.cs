using Auction.Domain.Models.Common;
using System.Collections.Generic;

namespace Auction.Domain.Models
{
    public class Product : EntityBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Picture> Pictures { get; set; }
    }
}
