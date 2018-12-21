using Auction.API.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.Swagger;

namespace Auction.API.Configuration
{
    public static class ConfigurationHelper
    {
        public static IServiceCollection AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Auction API", Version = "v1" });
                c.CustomSchemaIds(x => x.FullName);
            });

            return services;
        }

        public static IServiceCollection AddCustomMvc(this IServiceCollection services)
        {
            services
                .AddMvc()
                .AddJsonOptions(options =>
                {
                    //options.SerializerSettings.MaxDepth = 5;
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    JsonConvert.DefaultSettings = () => options.SerializerSettings;
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            return services;
        }

        public static IApplicationBuilder UseCustomCors(this IApplicationBuilder app)
        {
            app.UseCors(builder =>
            {
                builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowAnyOrigin()
                    .AllowCredentials();
            });

            return app;
        }

        public static IApplicationBuilder UseSawaggerWithDocs(this IApplicationBuilder app)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Auction");
            });

            return app;
        }

        public static IApplicationBuilder UseNotifyHub(this IApplicationBuilder app)
        {
            app.UseSignalR(route => { route.MapHub<NotifyHub>("/NotifyHub"); });

            return app;
        }

        public static IApplicationBuilder UseDeveloperExceptionPageIfDebug(this IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            return app;
        }
    }
}
