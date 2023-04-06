using MapAudit.Services.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MapAudit.WepApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CarrierController : ControllerBase
    {
        private readonly ICarrierService _carrierService;

        public CarrierController(ICarrierService carrierService)
        {
            _carrierService = carrierService;
        }

        [HttpGet("GetCarriers")]
        public async Task<IActionResult> GetCarrier()
        {
            var carries = await _carrierService.GetCarriers();
            return Ok(carries);
        }
    }
}
