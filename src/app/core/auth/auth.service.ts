import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'mythera_auth_token';
  private apiUrl = `${environment.apiUrl}/auth/login`;

  private tokenSignal = signal<string | null>(
    localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey)
  );
  public isAuthenticated = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {}

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<{access_token: string}>(this.apiUrl, { username, password, rememberMe }).pipe(
      tap(res => {
        if (res.access_token) {
          if (rememberMe) {
            localStorage.setItem(this.tokenKey, res.access_token);
            sessionStorage.removeItem(this.tokenKey);
          } else {
            sessionStorage.setItem(this.tokenKey, res.access_token);
            localStorage.removeItem(this.tokenKey);
          }
          this.tokenSignal.set(res.access_token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
