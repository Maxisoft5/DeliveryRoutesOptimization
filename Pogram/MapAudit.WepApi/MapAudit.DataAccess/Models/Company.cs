namespace MapAudit.DataAccess.Models
{
    public class Company : BaseEntity
    {
        public string Name { get; set; }
        public List<Carrier> Carriers { get; set; }
    }
}
