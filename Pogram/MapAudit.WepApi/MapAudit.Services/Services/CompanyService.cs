using MapAudit.DataAccess.Context;
using MapAudit.DataAccess.Models;
using MapAudit.Services.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MapAudit.Services.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly DataContext _dataContext;

        public CompanyService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IEnumerable<Company>> GetCompanies()
        {
            var companies = await _dataContext.Companies.AsNoTracking().ToListAsync();
            return companies;   
        }
    }
}
