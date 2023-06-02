import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Company } from "../models/company";

@Injectable({
    providedIn: 'root',
  })

  export class CompanyService {

    url: string = "https://localhost:7275/company";

    constructor(private httpClient: HttpClient) { }

    public getAll(): Observable<Company[]> {
        return this.httpClient.get<Company[]>(`${this.url}/GetAll`);
    }


  }