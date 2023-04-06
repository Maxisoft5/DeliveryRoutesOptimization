using MapAudit.DataAccess.Context;
using MapAudit.Services.Services;
using MapAudit.Services.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Refit;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var googleMapsUrl = builder.Configuration.GetSection("GoogleMapsApi").GetSection("Url").Value;

var settings = new RefitSettings(new NewtonsoftJsonContentSerializer());
builder.Services.AddRefitClient<IDirectionsGoogleMapApi>(settings)
                .ConfigureHttpClient(c => c.BaseAddress = new Uri(googleMapsUrl));

builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(connectionString, x =>
    {
        x.MigrationsHistoryTable(
            HistoryRepository.DefaultTableName,
            "mapAudit");
        x.CommandTimeout(120);
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AppPolicy", options =>
    {
        options.AllowAnyHeader()
               .AllowAnyMethod()
               .AllowAnyOrigin();
    });
});

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<ICarrierService, CarrierService>();
builder.Services.AddScoped<IDeliveryPathService, DeliveryPathService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AppPolicy");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
