using System.Text.Json.Serialization;

namespace MapAudit.Services.DTO
{
    public class Leg
    {
        public Distance Distance { get; set; }
        public Duration Duration { get; set; }
        [JsonPropertyName("start_address")]
        public string StartAddress { get; set; }
        [JsonPropertyName("end_address")]
        public string EndAddress { get; set; }
        [JsonPropertyName("start_location")]
        public StartLocation StartLocation { get; set; }
        [JsonPropertyName("end_location")]
        public EndLocation EndLocation { get; set; }
        [JsonPropertyName("overview_polyline")]
        public string OverviewPolyline { get; set; }
        public string Summary { get; set; }
        public List<string> Warnings { get; set; }
        [JsonPropertyName("waypoint_order")]
        public List<string> WayPointOrder { get; set; }

    }
}
