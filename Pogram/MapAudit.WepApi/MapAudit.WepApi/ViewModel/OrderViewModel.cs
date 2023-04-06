using MapAudit.DataAccess.Models;

namespace MapAudit.WepApi.ViewModel
{
    public class OrderViewModel
    {
        public string ProductName { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Volume { get; set; }
        public int Weight { get; set; }
        public List<DeliveryPoint> DeliveryPoints { get; set; }
        public long CarrierId { get; set; }
        public long CompanyId { get; set; }
    }
}
