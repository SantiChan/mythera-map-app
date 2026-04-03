import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/api.service';

@Injectable({ providedIn: 'root' })
export class SubracesService {
    private readonly baseUrl = '/subraces';

    constructor(private apiService: ApiService) { }

    getSubracesByRace(raceId: string): Observable<any[]> {
        return this.apiService.get(`${this.baseUrl}/by-race/${raceId}`);
    }

    getSubraces(): Observable<any[]> {
        return this.apiService.get(this.baseUrl);
    }

    createSubrace(data: FormData): Observable<any> {
        return this.apiService.post(this.baseUrl, data);
    }

    updateSubrace(id: string, data: FormData): Observable<any> {
        return this.apiService.patch(`${this.baseUrl}/${id}`, data);
    }

    deleteSubrace(id: string): Observable<any> {
        return this.apiService.delete(`${this.baseUrl}/${id}`);
    }
}
