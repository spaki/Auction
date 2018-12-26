using Auction.API.Hubs;
using Auction.Domain.Managers;
using Auction.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Auction.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        IHubContext<NotifyHub> hub;

        public AuctionController(IHubContext<NotifyHub> hub)
        {
            this.hub = hub;
        }

        [HttpGet]
        public ActionResult<List<Domain.Models.Auction>> Get() => AuctionManager.ListAll();

        [HttpGet("availables")]
        public ActionResult<List<Domain.Models.Auction>> GetAvailables() => AuctionManager.ListAvailables();

        [HttpPost]
        public async Task<ActionResult<AuctionProduct>> Post([FromBody] Domain.Models.Auction auction)
        {
            AuctionManager.Add(auction);

            auction.OnAvailable += Auction_OnAvailable;
            auction.OnStart += Auction_OnStart;
            auction.OnEnd += Auction_OnEnd;

            auction.AuctionProducts.ForEach(auctionProduct => { 
                auctionProduct.OnStart += AuctionProduct_OnStart;
                auctionProduct.OnBidOffered += AuctionProduct_OnBidOffered;
                auctionProduct.OnTick += AuctionProduct_OnTick;
                auctionProduct.OnEnd += AuctionProduct_OnEnd;
            });

            auction.Begin();

            return Ok(auction);
        }

        private void Auction_OnAvailable(Domain.Models.Auction auction)
        {
            hub.Clients.All.SendAsync("Auction_OnAvailable", JsonConvert.SerializeObject(auction));
        }

        private void Auction_OnStart(Domain.Models.Auction auction)
        {
            hub.Clients.All.SendAsync("Auction_OnStart", JsonConvert.SerializeObject(auction));
        }

        private void Auction_OnEnd(Domain.Models.Auction auction)
        {
            hub.Clients.All.SendAsync("Auction_OnEnd", JsonConvert.SerializeObject(auction));
            AuctionManager.ClearEnded();
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
        }
    }
}
