import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private apiService: ApiService) { }

  getToken() {
    return this.apiService.post('getBrainToken',{});
  }

}
