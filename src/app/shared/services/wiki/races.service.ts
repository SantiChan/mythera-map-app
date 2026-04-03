import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '../../api/api.service';

@Injectable({ providedIn: 'root' })
export class RacesService {
    private readonly baseUrl = '/races';
    private racesSubject = new BehaviorSubject<any[]>([]);
    public races$ = this.racesSubject.asObservable();

    constructor(private apiService: ApiService) { }

    getRaces(): Observable<any[]> {
        return this.apiService.get<any[]>(this.baseUrl).pipe(
            tap((races: any[]) => this.racesSubject.next(races))
        );
    }

    getRace(id: string): Observable<any> {
        return this.apiService.get(`${this.baseUrl}/${id}`);
    }

    createRace(data: FormData): Observable<any> {
        return this.apiService.post(this.baseUrl, data).pipe(
            tap(() => this.getRaces().subscribe())
        );
    }

    updateRace(id: string, data: FormData): Observable<any> {
        return this.apiService.patch(`${this.baseUrl}/${id}`, data).pipe(
            tap(() => this.getRaces().subscribe())
        );
    }

    deleteRace(id: string): Observable<any> {
        return this.apiService.delete(`${this.baseUrl}/${id}`).pipe(
            tap(() => this.getRaces().subscribe())
        );
    }
}
