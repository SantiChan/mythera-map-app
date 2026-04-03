import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/api.service';

@Injectable({ providedIn: 'root' })
export class TimelineService {
    private readonly baseUrl = '/timeline';

    constructor(private apiService: ApiService) { }

    // Eras
    getEras(): Observable<any[]> {
        return this.apiService.get(`${this.baseUrl}/eras`);
    }

    createEra(data: any): Observable<any> {
        return this.apiService.post(`${this.baseUrl}/eras`, data);
    }

    updateEra(id: string, data: any): Observable<any> {
        return this.apiService.patch(`${this.baseUrl}/eras/${id}`, data);
    }

    deleteEra(id: string): Observable<any> {
        return this.apiService.delete(`${this.baseUrl}/eras/${id}`);
    }

    // Events
    getEvents(): Observable<any[]> {
        return this.apiService.get(`${this.baseUrl}/events`);
    }

    createEvent(data: any): Observable<any> {
        return this.apiService.post(`${this.baseUrl}/events`, data);
    }

    updateEvent(id: string, data: any): Observable<any> {
        return this.apiService.patch(`${this.baseUrl}/events/${id}`, data);
    }

    deleteEvent(id: string): Observable<any> {
        return this.apiService.delete(`${this.baseUrl}/events/${id}`);
    }
}
