/* eslint-disable guard-for-in */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  url = 'http://localhost:5001/gopaintfunctions/europe-west3';

  constructor(private http: HttpClient) {}

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams(),
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (const k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.get(this.url + '/' + endpoint, { params });
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.post(this.url + '/' + endpoint, body);
  }
}
