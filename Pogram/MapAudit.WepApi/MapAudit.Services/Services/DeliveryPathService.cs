using MapAudit.DataAccess.Models;
using MapAudit.Services.DTO;
using MapAudit.Services.Services.Interfaces;
using MapAudit.WepApi.ViewModel;
using Microsoft.Extensions.Configuration;

namespace MapAudit.Services.Services
{
    public class DeliveryPathService : IDeliveryPathService
    {
        private readonly IDirectionsGoogleMapApi _directionsGoogleMap;
        private readonly IConfiguration _configuration;
        public DeliveryPathService(IDirectionsGoogleMapApi directionsGoogleMapApi, IConfiguration configuration)
        {
            _configuration = configuration;
            _directionsGoogleMap = directionsGoogleMapApi;
        }

        public async Task<List<DeliveryPointViewPointResult>> CalculateDefaultPathsForOrders(List<List<List<DeliveryPointDTO>>> generations)
        {
            var res = new List<DeliveryPointViewPointResult>();
            foreach (var generation in generations)
            {
                var genRes = new DeliveryPointViewPointResult();
                foreach (var population in generation)
                {
                    if (population.Count > 0)
                    {
                        var apiKey = _configuration.GetSection("GoogleMapsApi").GetSection("ApiKey").Value;
                        var paths = new List<DeliveryPath>();
                        for (int i = 0; i < population.Count() - 1; i++)
                        {
                            if (i % 8 == 0)
                            {
                                Thread.Sleep(3000);
                            }
                            var deliveryPath = new DeliveryPath();
                            var fromX = population[i].X;
                            var fromY = population[i].Y;
                            var toX = population[i + 1].X;
                            var toY = population[i + 1].Y;
                            deliveryPath.From = new DeliveryPoint()
                            {
                                X = fromX,
                                Y = fromY,
                                IsOrigin = population[i].IsOrigin,
                                IsDestination = population[i].IsDestination,
                                Address = population[i].Address
                            };
                            deliveryPath.To = new DeliveryPoint()
                            {
                                X = toX,
                                Y = toY,
                                IsOrigin = population[i + 1].IsOrigin,
                                IsDestination = population[i + 1].IsDestination,
                                Address = population[i+1].Address
                            };
                            var distance = await _directionsGoogleMap.GetDirection(fromX, fromY, toX, toY, apiKey);
                            deliveryPath.Distance = distance.Routes[0].Legs[0].Distance.Value;
                            deliveryPath.Hours = distance.Routes[0].Legs[0].Duration.Value;
                            paths.Add(deliveryPath);
                        }
                        genRes.DeliveryPaths = paths;
                        double distanceSum = 0;
                        double duratonSum = 0;
                        foreach (var ge in genRes.DeliveryPaths)
                        {
                            distanceSum += ge.Distance;
                            duratonSum += ge.Hours;
                        }
                        genRes.DurationSumm = duratonSum;
                        genRes.DistanceSumm = distanceSum;
                    }
                }
                res.Add(genRes);
            }
            return res;
        }
    }
}
