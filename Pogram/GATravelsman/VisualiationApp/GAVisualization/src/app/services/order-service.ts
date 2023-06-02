import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { Order } from "../models/order";
import { DeliveryPath } from "../models/deliverPath";

@Injectable({
    providedIn: 'root',
  })

  export class OrdersService {
    
    url: string = "https://localhost:7275/order";

    constructor(private httpClient: HttpClient) { }
  
    public getAllOrders(): Observable<Order[]> {
        return this.httpClient.get<Order[]>(`${this.url}/GetAllOrders`);
    }

    public getOrdersByCarrier(company: string): Observable<Order[]> {
        return this.httpClient.get<Order[]>(`${this.url}/GetOrdersByCarrierCompany?companyName=${company}`);
    }

    public addOrder(order: Order): Observable<Order> {
        return this.httpClient.post<Order>(`${this.url}/AddOrder`, order );
    }

    public deleteOrder(id: string) {
        return this.httpClient.delete(`${this.url}/RemoveOrderById?savedPath=${id}`);
    }

    public getDeliveryPathsByCarrier(carrierId: number): Observable<DeliveryPath[]> {
        return this.httpClient.get<DeliveryPath[]>(`${this.url}/GetDeliveryPathsByCarrier?carrierId=${carrierId}`);
    }
  }