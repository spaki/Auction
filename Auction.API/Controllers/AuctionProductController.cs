using Auction.Domain.Managers;
using Auction.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Auction.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionProductController : ControllerBase
    {
        [HttpPost("{id}/Bid")]
        public async Task<ActionResult<AuctionProduct>> PostBid(Guid id, [FromBody] Domain.DTO.Bid bid)
        {
            var auctionProduct = AuctionManager.GetAuctionProduct(id);
            var user = new User { Name = bid.UserName };
            auctionProduct.AddBid(user, bid.Value);
            return Ok();
        }
    }
}
