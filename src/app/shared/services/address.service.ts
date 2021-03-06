import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models/address/city.model';
import { Street } from '../models/address/street.model';
  
@Injectable()
export class AddressService {  

    constructor(private http: HttpClient) {}
  
    getCities(branchOfficeId: number): Observable<City[]> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append('branchOfficeId', branchOfficeId.toString())
        return this.http
            .get<City[]>(environment.apiServer + "addresses/cities", { params: queryParams })
    }

    getStreets(cityId: number): Observable<Street[]> {
        let queryParams = new HttpParams();
        queryParams = queryParams.append('cityId', cityId.toString())
        return this.http
            .get<Street[]>(environment.apiServer + "addresses/streets", { params: queryParams })
    }
}