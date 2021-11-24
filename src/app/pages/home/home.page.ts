import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { TokenService } from 'src/app/services/Token/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private tokenService:TokenService, private checkoutService:CheckoutService) { }

  ngOnInit() {
    this.getToken();
  }

  getToken(){
    this.tokenService.getToken().subscribe((token)=>{
      console.log(token);
    })
  }

}
