using MapAudit.DataAccess.Models;
using MapAudit.Services.Services.Interfaces;
using MapAudit.WepApi.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace MapAudit.WepApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GoogleMapApiTest : ControllerBase
    {
        private readonly ILogger<OrderController> _logger;
        private readonly IDirectionsGoogleMapApi _directionsGoogleMapApi;
        private readonly IDeliveryPathService _deliveryPathService;
        private readonly IConfiguration _configuration;

        public GoogleMapApiTest(ILogger<OrderController> logger, IDirectionsGoogleMapApi directionsGoogleMapApi, 
            IConfiguration configuration,
            IDeliveryPathService deliveryPathService)
        {
            _directionsGoogleMapApi = directionsGoogleMapApi;
            _logger = logger;
            _configuration = configuration;
            _deliveryPathService = deliveryPathService;
        }

        [HttpGet("GetDirectionRoute")]
        public async Task<IActionResult> GetDirectionRoute([FromQuery] double originLat, [FromQuery] double originLng,
                                                            [FromQuery] double destinationLat, [FromQuery] double destinationLng)
        {
            var apiKey = _configuration.GetSection("GoogleMapsApi").GetSection("ApiKey").Value;
            var result = await _directionsGoogleMapApi.GetDirection(originLat, originLng, destinationLat, destinationLng, apiKey);
            return Ok(result);  
        }

        [HttpPost("CalculateDefaultPathsForOrders")]
        public async Task<IActionResult> GetCalculatedDirections([FromBody] DeliveryPointViewPoint deliveryPointView)
        {
            var results = await _deliveryPathService.CalculateDefaultPathsForOrders(deliveryPointView.DeliveryPoints);

            return Ok(results.OrderBy(x => x.DistanceSumm));
        }

    }
}
