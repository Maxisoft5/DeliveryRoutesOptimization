using System.Text.Json.Serialization;

namespace MapAudit.Services.DTO
{
    public class DirectionResponse
    {
        [JsonPropertyName("geocoded_waypoints")]
        public List<WayPointResponse> GeocodedWaypoints { get; set; }
        public List<Route> Routes { get; set; }
        public string Status { get; set; }

    }
}
