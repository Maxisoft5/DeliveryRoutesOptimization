namespace MapAudit.Services.DTO
{
    public class OrderDTO
    {
        public string ProductName { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Volume { get; set; }
        public int Weight { get; set; }
        public List<DeliveryPointDTO> GeneticAlgorithmSolution { get; set; }
        public string GeneticAlgorithmSolutionSummary { get; set; }
        public List<DeliveryPointDTO> GreedyAlgorithmSolution { get; set; }
        public string GreedyAlgorithmSolutionSummary { get; set; }
        public List<DeliveryPointDTO> DeliveryPoints { get; set; }
        public long? CarrierId { get; set; }
        public CarrierDTO Carrier { get; set; }
        public long? CompanyId { get; set; }
        public CompanyDTO Company { get; set; }
        public List<DeliveryPathDTO> DeliveryPaths { get; set; }
    }
}
