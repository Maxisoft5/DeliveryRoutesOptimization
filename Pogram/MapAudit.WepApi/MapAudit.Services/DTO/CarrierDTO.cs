using MapAudit.DataAccess.Models;

namespace MapAudit.Services.DTO
{
    public class CarrierDTO
    {
        public string Name { get; set; }
        public int DrivingExpirienceYears { get; set; }
        public TruckType TruckType { get; set; }
        public int FuelConsumptionInLitersInTownPer100Km { get; set; }
        public int AverageSpeedPerKmInTown { get; set; }
        public long? CompanyId { get; set; }
        public CompanyDTO Company { get; set; }
        public List<OrderDTO> Orders { get; set; }
    }
}
