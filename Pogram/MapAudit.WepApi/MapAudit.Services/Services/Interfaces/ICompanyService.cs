using MapAudit.DataAccess.Models;

namespace MapAudit.Services.Services.Interfaces
{
    public interface ICompanyService
    {
        public Task<IEnumerable<Company>> GetCompanies();
    }
}
