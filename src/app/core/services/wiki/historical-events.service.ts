import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HistoricalEvent {
  _id?: string;
  name: string;
  descriptionHtml?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalEventsService {
  private apiUrl = `${environment.apiUrl}/historical-events`;

  constructor(private http: HttpClient) {}

  getEvents(): Observable<HistoricalEvent[]> {
    return this.http.get<HistoricalEvent[]>(this.apiUrl);
  }

  getEvent(id: string): Observable<HistoricalEvent> {
    return this.http.get<HistoricalEvent>(`${this.apiUrl}/${id}`);
  }

  createEvent(formData: FormData): Observable<HistoricalEvent> {
    return this.http.post<HistoricalEvent>(this.apiUrl, formData);
  }

  updateEvent(id: string, formData: FormData): Observable<HistoricalEvent> {
    return this.http.patch<HistoricalEvent>(`${this.apiUrl}/${id}`, formData);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
