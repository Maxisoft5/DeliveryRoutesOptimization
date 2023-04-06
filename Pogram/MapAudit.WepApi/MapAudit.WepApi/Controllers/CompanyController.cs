using MapAudit.Services.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MapAudit.WepApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _companyService.GetCompanies());
        }
    }
}
