import { DeliveryPoint } from "./delivery-point";

export class DeliveryPath {
    id: number = 0;
    distance: number = 0;
    hours: number = 0;
    from: DeliveryPoint | undefined;
    to: DeliveryPoint | undefined;
    orderId: number = 0;
}