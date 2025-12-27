import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * A service that extends the Angular HttpClient to add the API URL
 */
export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export interface ApiServiceInterface {
  get<T>(endPoint: string, options?: IRequestOptions): Observable<T>;

  post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T>;

  put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T>;

  delete<T>(endPoint: string, options?: IRequestOptions): Observable<T>;

  patch<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T>; 
}

@Injectable({ providedIn: 'root' })
export class ApiService implements ApiServiceInterface {

  private api = `${environment.apiUrl}`;

  public constructor(public http: HttpClient) { }

  /**
   * GET request
   * @param {string} endPoint end point for the get
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.get<T>(this.api + endPoint, options);
  }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.http.post<T>(this.api + endPoint, params, options);
  }

  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.http.put<T>(this.api + endPoint, params, options);
  }

  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    return this.http.delete<T>(this.api + endPoint, options);
  }

  /**
   * PATCH request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public patch<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    return this.http.patch<T>(this.api + endPoint, params, options);
  }
}