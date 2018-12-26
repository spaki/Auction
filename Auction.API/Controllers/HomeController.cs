using Auction.Domain.Models;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Auction.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public ActionResult<ServerInfo> Get() => Ok(new ServerInfo { CurrentDateTime = DateTime.Now, CurrentUTCDateTime = DateTime.UtcNow });
    }
}
