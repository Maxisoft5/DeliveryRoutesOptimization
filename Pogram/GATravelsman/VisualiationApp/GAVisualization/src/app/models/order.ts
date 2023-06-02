import { Point } from "./point";

export class Order {
    productName: string = "";
    departureTime: Date | undefined;
    arrivalTime: Date | undefined;
    volume: string = "";
    weight: string = ""; 
    deliveryPoints: Point[] =[];
    companyId: number | undefined;
    carrierId?: number;
}