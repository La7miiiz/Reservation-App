import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = '/api/utilisateurs';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/me`, data);
  }

  getLogs() {
    return this.http.get<any[]>(`${this.apiUrl}/logs`);
  }

  getAllUsers() {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getAllReservations() {
    return this.http.get<any[]>('/api/reservations');
  }

  cancelReservation(id: number) {
    return this.http.delete(`/api/reservations/${id}`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
