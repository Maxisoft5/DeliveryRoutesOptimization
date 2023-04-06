namespace MapAudit.Services.DTO
{
    public class DeliveryPointDTO
    {
        public long Id { get; set; }
        public string Address { get; set; }
        public bool IsOrigin { get; set; }
        public bool IsDestination { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public int GeneticAlgoritmOrder { get; set; }
        public List<DeliveryPathDTO>? DeliveryPathsFrom { get; set; }
        public List<DeliveryPathDTO>? DeliveryPathsTo { get; set; }
    }
}
