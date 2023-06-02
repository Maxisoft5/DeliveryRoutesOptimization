import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Carrier } from "../models/carrier";


@Injectable({
    providedIn: 'root',
  })

  export class CarrierService {

    url: string = "https://localhost:7275/carrier";

    constructor(private httpClient: HttpClient) { }

    public getAll(): Observable<Carrier[]> {
        return this.httpClient.get<Carrier[]>(`${this.url}/GetCarriers`);
    }

  }