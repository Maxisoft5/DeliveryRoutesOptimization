namespace MapAudit.DataAccess.Models
{
    public class DeliveryPoint : BaseEntity
    {
        public string? Address { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public bool IsOrigin { get; set; }
        public bool IsDestination { get; set; }
        public List<DeliveryPath>? DeliveryPathsFrom { get; set; }
        public List<DeliveryPath>? DeliveryPathsTo { get; set; }
    }
}
