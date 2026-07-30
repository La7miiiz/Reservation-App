import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserData {
  id: number;
  nom: string;
  email: string;
  role: string;
  avatarSeed?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

  signup(payload: { nom: string; email: string; motDePasse: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

  login(credentials: { email: string; motDePasse: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res?.token) {
          localStorage.setItem('salle_token', res.token);
          localStorage.setItem('salle_user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('salle_token');
    localStorage.removeItem('salle_user');
  }

  getToken(): string | null {
    return localStorage.getItem('salle_token');
  }

  getUser(): UserData | null {
    const data = localStorage.getItem('salle_user');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('salle_token');
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }
}
