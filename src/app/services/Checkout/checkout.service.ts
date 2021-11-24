import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private apiService: ApiService) { }

  checkOut(){
    return this.apiService.get('checkoutBrain');

  }

}
