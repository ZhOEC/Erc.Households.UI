import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
  
@Injectable()
export class ReportService {  
    constructor(private http: HttpClient) {}

    getReport(slug: string, branchOfficeId: number, periodId: number): Observable<Blob> {
        let queryParams = new HttpParams()
        queryParams = queryParams.append('branch_office_id', branchOfficeId.toString())
        queryParams = queryParams.append('period_id', periodId.toString())
        return this.http.get(`${environment.apiServer}reports/` + slug, { params: queryParams, responseType: 'blob' })
    }
}