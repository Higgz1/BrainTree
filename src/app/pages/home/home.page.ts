import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { TokenService } from 'src/app/services/Token/token.service';

declare const braintree;
declare const client;
declare const paypal;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {


  constructor(public loadingController: LoadingController,private tokenService: TokenService, private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.getToken();
  }

  async getToken() {
    const loading = await this.loadingController.create({
      spinner: "circles",
      message: 'Please wait...',
    });
    await loading.present();

    this.tokenService.getToken().subscribe((token:any) => {
      console.log(token.clientToken);

      braintree.dropin.create({
        authorization: token.clientToken,
        container: document.getElementById('dropin-container'),
      });
      loading.dismiss();
    })




  }

}
