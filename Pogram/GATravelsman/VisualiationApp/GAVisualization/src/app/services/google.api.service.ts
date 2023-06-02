import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CalculatedRouteModel } from "../models/calculatedRouteModel";
import { DeliveryPath } from "../models/deliverPath";
import { DeliveryPoint } from "../models/delivery-point";
import { DirectionResponse } from "../models/direction.response";
import { Point } from "../models/point";


@Injectable({
    providedIn: 'root',
  })

  export class GoogleApiService {
    
    url: string = "https://localhost:7275/googleMapApiTest";

    constructor(private httpClient: HttpClient) { }
  

    public getDistanceBetweenLocations(originLat: number, originLng: number, destinationLat: number, destinationLng: number): Observable<DirectionResponse> {
        return this.httpClient.get<DirectionResponse>(`${this.url}/GetDirectionRoute?originLat=${originLat}&originLng=${originLng}&destinationLat=${destinationLat}&destinationLng=${destinationLng}`);
    }

    getCalculatedDefaultPathsForOrders(deliveryPoints: Point[][][]): Observable<any> {
        let body = {
          deliveryPoints: deliveryPoints
        };
        return this.httpClient.post<any>(`${this.url}/CalculateDefaultPathsForOrders`, body);
    }

  }