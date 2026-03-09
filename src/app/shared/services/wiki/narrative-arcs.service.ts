import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/api.service';

@Injectable({ providedIn: 'root' })
export class NarrativeArcsService {
  private readonly baseUrl = '/narrative-arcs';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<any[]> {
    return this.apiService.get(this.baseUrl);
  }

  getById(id: string): Observable<any> {
    return this.apiService.get(`${this.baseUrl}/${id}`);
  }

  create(data: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('descriptionHtml', data.descriptionHtml);
    if (file) {
      formData.append('file', file);
    }
    return this.apiService.post(this.baseUrl, formData);
  }

  update(id: string, data: any, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('descriptionHtml', data.descriptionHtml);
    if (file) {
      formData.append('file', file);
    }
    return this.apiService.patch(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: string): Observable<any> {
    return this.apiService.delete(`${this.baseUrl}/${id}`);
  }

  // Session methods
  addSession(arcId: string, sessionData: any): Observable<any> {
    return this.apiService.post(`${this.baseUrl}/${arcId}/sessions`, sessionData);
  }

  updateSession(arcId: string, sessionId: string, sessionData: any): Observable<any> {
    return this.apiService.patch(`${this.baseUrl}/${arcId}/sessions/${sessionId}`, sessionData);
  }

  deleteSession(arcId: string, sessionId: string): Observable<any> {
    return this.apiService.delete(`${this.baseUrl}/${arcId}/sessions/${sessionId}`);
  }
}
