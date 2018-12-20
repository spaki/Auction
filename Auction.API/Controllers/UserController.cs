using Auction.Domain.Managers;
using Auction.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace Auction.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost]
        public ActionResult<User> Post([FromBody] User value)
        {
            UserManager.Add(value);
            return Ok(value);
        }
    }
}
