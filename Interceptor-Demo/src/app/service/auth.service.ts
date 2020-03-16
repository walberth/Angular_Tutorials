import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private $httpClient: HttpClient;

  constructor(protected httpClient: HttpClient) {
    this.$httpClient = httpClient;
  }

  login(username: string, password: string): Observable<string> {
    return this.$httpClient.get<string>(environment.backend + '/api/auth/login?username=' + username + '&password=' + password);
  }
}
