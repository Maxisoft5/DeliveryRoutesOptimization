namespace MapAudit.DataAccess.Models
{
    public class Carrier : BaseEntity
    {
        public string Name { get; set; }
        public int DrivingExpirienceYears { get; set; }
        public TruckType TruckType { get; set; }
        public int FuelConsumptionInLitersInTownPer100Km { get; set; }
        public int AverageSpeedPerKmInTown { get; set; }
        public long? CompanyId { get; set; }
        public Company Company { get; set; }
        public List<Order> Orders { get; set; } 
    }
}
