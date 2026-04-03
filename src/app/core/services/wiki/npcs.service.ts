import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Npc } from '../../models/wiki/npc.model';

@Injectable({ providedIn: 'root' })
export class NpcsService {
  private apiUrl = `${environment.apiUrl}/npcs`;

  constructor(private http: HttpClient) {}

  getNpcs(): Observable<Npc[]> {
    return this.http.get<Npc[]>(this.apiUrl);
  }

  getNpc(id: string): Observable<Npc> {
    return this.http.get<Npc>(`${this.apiUrl}/${id}`);
  }

  createNpc(data: FormData): Observable<Npc> {
    return this.http.post<Npc>(this.apiUrl, data);
  }

  updateNpc(id: string, data: FormData): Observable<Npc> {
    return this.http.patch<Npc>(`${this.apiUrl}/${id}`, data);
  }

  deleteNpc(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
