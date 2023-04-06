using System.Text.Json.Serialization;

namespace MapAudit.Services.DTO
{
    public class WayPointResponse
    {
        [JsonPropertyName("geocoder_status")]
        public string Status { get; set; }
        [JsonPropertyName("place_id")]
        public string PlaceId { get; set; }
        public List<string> Types { get; set; }
        [JsonPropertyName("partial_match")]
        public string PartialMatch { get; set; }
    }
}
