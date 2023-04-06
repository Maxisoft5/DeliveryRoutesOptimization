using MapAudit.DataAccess.Models;

namespace MapAudit.Services.Helpers
{
    public static class FuelConsuptionHelper
    {
        public static double GetFuelConsuptionPer100KmInLitresByTruckType(TruckType truckType)
        {
            double fuel = 0;
            switch (truckType)
            {
                case TruckType.BoxTruck:
                {
                    fuel = 13.1d;
                    break;
                }
                case TruckType.TankTrucks:
                {
                    fuel = 13.5d;
                    break;
                }
                case TruckType.RefrigeratorTruck:
                {
                    fuel = 9.5d;
                    break;
                }
            }
            return fuel;
        }
    }
}
