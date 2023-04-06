using MapAudit.DataAccess.Models;
using MapAudit.Services.Services.Interfaces;
using MapAudit.WepApi.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace MapAudit.WepApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly ILogger<OrderController> _logger;
        private readonly IOrderService _orderService;

        public OrderController(ILogger<OrderController> logger, IOrderService orderService)
        {
            _orderService = orderService;
            _logger = logger;
        }

        [HttpPost("AddOrder")]
        public async Task<IActionResult> AddPath(OrderViewModel orderModel)
        {
            var order = new Order()
            {
                ArrivalTime = orderModel.ArrivalTime,
                DeliveryPoints = orderModel.DeliveryPoints,
                DepartureTime = orderModel.DepartureTime,
                ProductName = orderModel.ProductName,
                Volume = orderModel.Volume,
                Weight = orderModel.Weight,
                CompanyId = orderModel.CompanyId
            };
            var saved = await _orderService.SaveOrder(order);
            return Ok(saved);
        }

        [HttpPost("CalculatePathsForCarrierOrders")]
        public async Task<IActionResult> CalculatePathsForCarrierOrders([FromQuery] string companyName, [FromQuery] long carrierId)
        {
            await _orderService.CalculateOrderPathsForCarrier(companyName, carrierId);
            return Ok();
        }

        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrders();
            return Ok(orders);
        }

        [HttpGet("GetOrdersByCarrierCompany")]
        public async Task<IActionResult> GetOrdersByCompany([FromQuery] string companyName)
        {
            var orders = await _orderService.GetOrdersByCompany(companyName);
            return Ok(orders);
        }

        [HttpGet("GetDeliveryPathsByCarrier")]
        public async Task<IActionResult> GetPathsByCarrier([FromQuery] long carrierId)
        {
            var paths = await _orderService.GetOrderPathsForCarrier(carrierId);
            return Ok(paths);
        }

        [HttpDelete("RemoveOrderById")]
        public async Task<IActionResult> RemovePath( [FromQuery] long id)
        {
            var result = await _orderService.DeleteOrder(id);
            return Ok();
        }




    }
}