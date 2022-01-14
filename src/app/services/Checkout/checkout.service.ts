import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private apiService: ApiService) { }

  checkOut(allValues){
    console.log('values',allValues);
    return this.apiService.post('checkoutBraintree',allValues);

  }

}
