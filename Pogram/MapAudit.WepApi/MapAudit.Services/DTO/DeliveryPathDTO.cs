namespace MapAudit.Services.DTO
{
    public class DeliveryPathDTO
    {
        public DeliveryPointDTO From { get; set; }
        public DeliveryPointDTO To { get; set; }
        public double Distance { get; set; }
        public double Hours { get; set; }
        public OrderDTO Order { get; set; }
        public long OrderId { get; set; }
    }
}
