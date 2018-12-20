using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Auction.API.Hubs;
using Auction.Domain.Managers;
using Auction.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Auction.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionProductController : ControllerBase
    {
        IHubContext<NotifyHub> hub;

        public AuctionProductController(IHubContext<NotifyHub> hub)
        {
            this.hub = hub;
        }

        [HttpGet]
        public ActionResult<List<AuctionProduct>> Get() => AuctionManager.List();

        [HttpPost]
        public async Task<ActionResult<AuctionProduct>> Post([FromBody] AuctionProduct auctionProduct)
        {
            AuctionManager.Add(auctionProduct);

            auctionProduct.OnStart += AuctionProduct_OnStart;
            auctionProduct.OnBidOffered += AuctionProduct_OnBidOffered;
            auctionProduct.OnTick += AuctionProduct_OnTick;
            auctionProduct.OnEnd += AuctionProduct_OnEnd;

            auctionProduct.Start();

            return Ok(auctionProduct);
        }

        [HttpPost("{id}/Bid")]
        public async Task<ActionResult<AuctionProduct>> PostBid(Guid id, [FromBody] Domain.DTO.Bid bid)
        {
            var auctionProduct = AuctionManager.Get(id);
            var user = new User { Name = bid.UserName };
            auctionProduct.AddBid(user, bid.Value);
            return Ok();
        }

        private void AuctionProduct_OnStart(AuctionProduct auctionProduct)
        {
            hub.Clients.All.SendAsync("AuctionProduct_OnStart", JsonConvert.SerializeObject(auctionProduct));
        }

        private void AuctionProduct_OnBidOffered(Bid bid)
        {
            hub.Clients.Group(bid.AuctionProduct.Id.ToString()).SendAsync("AuctionProduct_OnBidOffered", JsonConvert.SerializeObject(bid));
        }

        private void AuctionProduct_OnTick(AuctionProduct auctionProduct)
        {
            hub.Clients.Group(auctionProduct.Id.ToString()).SendAsync("AuctionProduct_OnTick", JsonConvert.SerializeObject(auctionProduct));
        }

        private void AuctionProduct_OnEnd(AuctionProduct auctionProduct)
        {
            hub.Clients.Group(auctionProduct.Id.ToString()).SendAsync("AuctionProduct_OnEnd", JsonConvert.SerializeObject(auctionProduct));
            AuctionManager.ClearEnded();
        }

        //[HttpGet("{id}")]
        //public ActionResult<string> Get(int id) => AuctionManager.List()
        //{
        //}

        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
