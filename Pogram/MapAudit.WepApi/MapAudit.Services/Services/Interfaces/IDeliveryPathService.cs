using MapAudit.DataAccess.Models;
using MapAudit.Services.DTO;
using MapAudit.WepApi.ViewModel;

namespace MapAudit.Services.Services.Interfaces
{
    public interface IDeliveryPathService
    {
        public Task<List<DeliveryPointViewPointResult>> CalculateDefaultPathsForOrders(List<List<List<DeliveryPointDTO>>> pointViewPoints);
    }
}
