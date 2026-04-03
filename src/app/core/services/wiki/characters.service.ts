import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Character } from '../../models/wiki/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private apiUrl = `${environment.apiUrl}/characters`;

  constructor(private http: HttpClient) { }

  getCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(this.apiUrl);
  }

  getCharacterById(id: string): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  createCharacter(character: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, character);
  }

  updateCharacter(id: string, character: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, character);
  }

  deleteCharacter(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
