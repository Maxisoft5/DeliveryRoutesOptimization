import { DeliveryPath } from "./deliverPath";

export class CalculatedRouteModel {
    public deliveryPaths: DeliveryPath[]=[];
    public distanceSumm: number = 0;
    public durationSumm: number = 0;
}
