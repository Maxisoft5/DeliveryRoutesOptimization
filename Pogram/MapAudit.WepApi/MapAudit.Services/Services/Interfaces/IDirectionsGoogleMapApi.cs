using MapAudit.Services.DTO;
using Refit;

namespace MapAudit.Services.Services.Interfaces
{
    public interface IDirectionsGoogleMapApi
    {
        [Post("/directions/json?origin={originLat},{originLng}&destination={destinationLat},{destinationLng}&key={apiKey}")]
        Task<DirectionResponse> GetDirection(double originLat, double originLng, double destinationLat, double destinationLng, string apiKey);
    }
}
