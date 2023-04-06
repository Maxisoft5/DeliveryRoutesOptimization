using System.Text.Json.Serialization;

namespace MapAudit.Services.DTO
{
    public class Route
    {
        public string Copyrights { get; set; }
        public List<Leg> Legs { get; set; }
    }
}
