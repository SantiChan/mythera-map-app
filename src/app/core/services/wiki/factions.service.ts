import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Faction } from '../../models/wiki/faction.model';

@Injectable({ providedIn: 'root' })
export class FactionsService {
  private apiUrl = `${environment.apiUrl}/factions`;

  constructor(private http: HttpClient) {}

  getFactions(): Observable<Faction[]> {
    return this.http.get<Faction[]>(this.apiUrl);
  }

  getFaction(id: string): Observable<Faction> {
    return this.http.get<Faction>(`${this.apiUrl}/${id}`);
  }

  createFaction(data: FormData): Observable<Faction> {
    return this.http.post<Faction>(this.apiUrl, data);
  }

  updateFaction(id: string, data: FormData): Observable<Faction> {
    return this.http.patch<Faction>(`${this.apiUrl}/${id}`, data);
  }

  deleteFaction(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
