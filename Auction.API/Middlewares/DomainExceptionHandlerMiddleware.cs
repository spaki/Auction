using Auction.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Net;
using System.Threading.Tasks;

namespace Auction.API.Middlewares
{
    public class DomainExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public DomainExceptionHandlerMiddleware(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (DomainException ex)
            {
                var result = JsonConvert.SerializeObject(new { ErrorType = nameof(DomainException), Error = ex });
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                await context.Response.WriteAsync(result);
            }
        }
    }
}
