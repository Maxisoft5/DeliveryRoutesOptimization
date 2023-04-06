using MapAudit.DataAccess.Models;
using MapAudit.Services.DTO;

namespace MapAudit.WepApi.ViewModel
{
    public class DeliveryPointViewPointResult
    {
        public List<DeliveryPath> DeliveryPaths { get; set; }
        public double DistanceSumm { get; set; }
        public double DurationSumm { get; set; }
    }
}
