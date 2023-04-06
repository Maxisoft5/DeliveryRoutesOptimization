using System.Text.Json.Serialization;

namespace MapAudit.Services.DTO
{
    public class Bound
    {
        public List<Northeast> Northeast { get; set; }
        public List<Southwest> Southwest { get; set; }
    }
}
