using MapAudit.DataAccess.Context;
using MapAudit.DataAccess.Models;
using MapAudit.Services.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MapAudit.Services.Services
{
    public class CarrierService : ICarrierService
    {
        private readonly DataContext _dataContext;
        public CarrierService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<Carrier>> GetCarriers()
        {
            return await _dataContext.Carriers.ToListAsync();
        } 
    }
}
