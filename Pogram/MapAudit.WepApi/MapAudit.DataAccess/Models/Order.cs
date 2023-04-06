using System.ComponentModel.DataAnnotations.Schema;

namespace MapAudit.DataAccess.Models
{
    public class Order : BaseEntity
    {
        public string ProductName { get;set; }
        public DateTime DepartureTime { get;set; }
        public DateTime ArrivalTime { get;set; }
        public int Volume { get; set; }
        public int Weight { get; set; } 
        [NotMapped]
        public List<DeliveryPoint> GeneticAlgorithmSolution { get; set; }
        [NotMapped]
        public string GeneticAlgorithmSolutionSummary { get; set; }
        [NotMapped]
        public List<DeliveryPoint> GreedyAlgorithmSolution { get; set; }
        [NotMapped]
        public string GreedyAlgorithmSolutionSummary { get; set; }
        public List<DeliveryPoint> DeliveryPoints { get; set; }
        public long? CarrierId { get; set; }
        public Carrier Carrier { get; set; }
        public long? CompanyId { get; set; }
        public Company Company { get; set; }
        public List<DeliveryPath> DeliveryPaths { get; set; }
    }
}
