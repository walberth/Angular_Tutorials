import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  getReport(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get(`http://localhost:8055/v1/api/report`, { headers, responseType: 'blob' as 'json'});
  }
}
