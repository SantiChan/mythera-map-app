import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/api.service';

@Injectable({ providedIn: 'root' })
export class GodsService {
    private readonly baseUrl = '/gods';

    constructor(private apiService: ApiService) { }

    getGods(): Observable<any[]> {
        return this.apiService.get(this.baseUrl);
    }

    createGod(data: FormData): Observable<any> {
        return this.apiService.post(this.baseUrl, data);
    }

    updateGod(id: string, data: FormData): Observable<any> {
        return this.apiService.patch(`${this.baseUrl}/${id}`, data);
    }

    deleteGod(id: string): Observable<any> {
        return this.apiService.delete(`${this.baseUrl}/${id}`);
    }
}
