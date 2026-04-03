import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Rule {
  _id?: string;
  name: string;
  descriptionHtml?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private apiUrl = `${environment.apiUrl}/rules`;

  constructor(private http: HttpClient) {}

  getRules(): Observable<Rule[]> {
    return this.http.get<Rule[]>(this.apiUrl);
  }

  getRule(id: string): Observable<Rule> {
    return this.http.get<Rule>(`${this.apiUrl}/${id}`);
  }

  createRule(formData: FormData): Observable<Rule> {
    return this.http.post<Rule>(this.apiUrl, formData);
  }

  updateRule(id: string, formData: FormData): Observable<Rule> {
    return this.http.patch<Rule>(`${this.apiUrl}/${id}`, formData);
  }

  deleteRule(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
