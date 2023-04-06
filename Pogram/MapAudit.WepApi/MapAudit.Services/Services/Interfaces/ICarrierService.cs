using MapAudit.DataAccess.Models;

namespace MapAudit.Services.Services.Interfaces
{
    public interface ICarrierService
    {
        public Task<IEnumerable<Carrier>> GetCarriers();
    }
}
