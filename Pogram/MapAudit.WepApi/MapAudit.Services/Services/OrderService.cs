using MapAudit.DataAccess.Context;
using MapAudit.DataAccess.Models;
using MapAudit.Services.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MapAudit.Services.Services
{
    public class OrderService : IOrderService
    {
        private readonly DataContext _dbContext;
        private readonly IDirectionsGoogleMapApi _directionsGoogleMapApi;
        private readonly IConfiguration _configuration;
        public OrderService(DataContext dbContext, IDirectionsGoogleMapApi directionsGoogleMapApi, IConfiguration configuration)
        {
            _directionsGoogleMapApi = directionsGoogleMapApi;
            _configuration = configuration;
            _dbContext = dbContext;
        }

        public async Task CalculateOrderPathsForCarrier(string companyName, long carrierId)
        {
            var ordersPoints = await _dbContext.Orders.Include(x => x.Company).Include(x => x.DeliveryPoints)
                                .Where(x => x.Company.Name.ToLower() == companyName.ToLower() 
                                && x.CarrierId == carrierId).ToListAsync();

            var points = new List<(DeliveryPoint, long)>();

            foreach (var pointOrder in ordersPoints)
            {
                foreach (var point in pointOrder.DeliveryPoints)
                {
                    points.Add((point, pointOrder.Id));
                }
            }

            var apiKey = _configuration.GetSection("GoogleMapsApi").GetSection("ApiKey").Value;
            int requestCount = 0;
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                for (int i = 0; i < points.Count; i++)
                {
                    for (int j = i + 1; j < points.Count; j++)
                    {
                        requestCount++;
                        if (requestCount > 8)
                        {
                            Thread.Sleep(1000);
                            requestCount = 0;
                        }
                        var distance = await _directionsGoogleMapApi.GetDirection(points[i].Item1.X, points[i].Item1.Y, 
                                points[j].Item1.X, points[j].Item1.Y, apiKey);
                        var path = new DeliveryPath()
                        {
                            Distance = distance.Routes[0].Legs[0].Distance.Value / 1000,
                            Hours = (distance.Routes[0].Legs[0].Duration.Value / 60) / 60,
                            From = points[i].Item1,
                            To = points[j].Item1,
                            OrderId = points[i].Item2,
                        };
                        await _dbContext.DeliveryPaths.AddAsync(path);
                    }
                }
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }

        }

        public async Task<bool> DeleteOrder(long id)
        {
            var order = await _dbContext.Orders.FirstOrDefaultAsync(x => x.Id == id);
            if (order == null)
            {
                return false;
            }
            order.IsDelete = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            var orders = await _dbContext.Orders.AsNoTracking().ToListAsync();
            return orders;
        }

        public async Task<List<DeliveryPath>> GetOrderPathsForCarrier(long carrierId)
        {
            var delivery = new List<DeliveryPath>();
            var paths = await _dbContext.Orders.Include(x => x.DeliveryPaths).Include(x => x.Carrier)
                                .Where(x => x.CarrierId == carrierId).Select(x => x.DeliveryPaths).ToListAsync();
            foreach(var path in paths)
            {
                delivery.AddRange(path);
            }
            return delivery;

        }

        public async Task<IEnumerable<Order>> GetOrdersByCompany(string company)
        {
            var orders = await _dbContext.Orders.Include(x => x.Company).Include(x => x.DeliveryPoints)
                .Where(x => x.Company.Name == company).ToListAsync();
            return orders;
        }

        public async Task<Order> SaveOrder(Order order)
        {
            await _dbContext.Orders.AddAsync(order);
            await _dbContext.SaveChangesAsync();
            return order;
        }
    }
}
