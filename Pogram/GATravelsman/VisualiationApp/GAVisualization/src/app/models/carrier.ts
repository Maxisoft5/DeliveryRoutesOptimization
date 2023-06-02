import { Order } from "./order";
import { TruckType } from "./truckType";


export class Carrier {
    id: number = 0;
    name: string ="";
    info: string = "";
    truckType!: TruckType;
    fuelConsumptionInLitersInTownPer100Km: number = 0;
    drivingExpirienceYears: number = 0;
    companyId: number = 0;
    orders: Order[] | undefined;
}