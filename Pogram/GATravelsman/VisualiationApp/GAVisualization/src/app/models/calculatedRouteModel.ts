import { DeliveryPath } from "./deliverPath";
import { DeliveryPoint } from "./delivery-point";

export class CalculatedRouteModel {
    public deliveryPaths: DeliveryPath[]=[];
    public distanceSumm: number = 0;
    public durationSumm: number = 0;
    public name: string = "";
}