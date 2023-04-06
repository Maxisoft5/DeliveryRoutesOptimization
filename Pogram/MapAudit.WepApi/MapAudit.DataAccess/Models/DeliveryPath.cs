namespace MapAudit.DataAccess.Models
{
    public class DeliveryPath : BaseEntity
    {
        public DeliveryPoint From { get; set; }
        public DeliveryPoint To { get; set; }
        public double Distance { get; set; }
        public double Hours { get; set; }
        public Order Order { get; set; }
        public long OrderId { get; set; }
    }
}
