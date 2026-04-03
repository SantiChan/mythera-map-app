import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/api.service';

@Injectable({ providedIn: 'root' })
export class EternalsService {
    private readonly baseUrl = '/eternals';

    constructor(private apiService: ApiService) { }

    getEternals(): Observable<any[]> {
        return this.apiService.get(this.baseUrl);
    }

    createEternal(data: FormData): Observable<any> {
        return this.apiService.post(this.baseUrl, data);
    }

    updateEternal(id: string, data: FormData): Observable<any> {
        return this.apiService.patch(`${this.baseUrl}/${id}`, data);
    }

    deleteEternal(id: string): Observable<any> {
        return this.apiService.delete(`${this.baseUrl}/${id}`);
    }
}
