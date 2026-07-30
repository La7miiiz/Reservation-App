import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private apiUrl = '/api/salles';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createRoom(room: any) {
    return this.http.post(this.apiUrl, room);
  }

  deleteRoom(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getRoom(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateRoom(id: number, room: any) {
    return this.http.put(`${this.apiUrl}/${id}`, room);
  }
}
