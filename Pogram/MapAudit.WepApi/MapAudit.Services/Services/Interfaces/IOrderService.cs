using MapAudit.DataAccess.Models;

namespace MapAudit.Services.Services.Interfaces
{
    public interface IOrderService
    {
        public Task CalculateOrderPathsForCarrier(string companyName, long carrierId);
        public Task<List<DeliveryPath>> GetOrderPathsForCarrier(long carrierId);
        public Task<Order> SaveOrder(Order savedPath);
        public Task<IEnumerable<Order>> GetAllOrders();
        public Task<IEnumerable<Order>> GetOrdersByCompany(string company);
        public Task<bool> DeleteOrder(long id);

    }
}
