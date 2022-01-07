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
  constructor(
    public loadingController: LoadingController,
    private tokenService: TokenService,
    private checkoutService: CheckoutService
  ) {
    this.getToken();
    // this.handleBraintreePayment('any');
  }

  ngOnInit() {
    (document.getElementById('purchase') as any).style.visibility = 'hidden';
  }

  async getToken() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Please wait...',
    });
    await loading.present();
    const purchase = document.querySelector('#purchase');

    this.tokenService.getToken().subscribe((token: any) => {
      // console.log(token.clientToken);
      const clientToken = token.clientToken;

      braintree.dropin
        .create({
          authorization: clientToken,
          container: document.getElementById('dropin-container'),
          //example paypla integration
          paypal: {
            flow: 'checkout',
            amount: '10.00',
            currency: 'USD',
          },
          card: {
            // overrides: {
            //   fields: {
            //     number: {
            //       placeholder: '1111 1111 1111 1111' // Update the number field placeholder
            //     },
            //     postalCode: {
            //       minlength: 5 // Set the minimum length of the postal code field
            //     },
            //     cvv: {
            //       maskInput: true
            //     } // Remove the CVV field from your form
            //   },
            //   styles: {
            //     input: {
            //       'font-size': '18px' // Change the font size for all inputs
            //     },
            //     ':focus': {
            //       color: 'black' // Change the focus color to red for all inputs
            //     }
            //   }
            // }
          },
          // onPaymentMethodReceived: function (obj) {
          //   console.log(obj.nonce);
          //   console.log('Root');
          // }
        })
        .then((dropinInstance) => {
          loading.dismiss();

          dropinInstance.on('changeActiveView', (event) => {
            if (event.newViewId === 'options') {
              (document.getElementById('purchase') as any).style.visibility =
                'hidden';

              // (document.getElementById('#purchase') ).disabled = false;
            } else if (event.newViewId === 'paypal') {
              (document.getElementById('purchase') as any).style.visibility =
                'hidden';
            } else if (event.newViewId === 'card') {
              // this.Displayed != this.Displayed ;
              (document.getElementById('purchase') as any).style.visibility =
                'visible';
            }
          });

          purchase.addEventListener('click', () => {
            dropinInstance
              .requestPaymentMethod()
              .then((payload) => {
                // console.log('payload', payload.nonce);
                this.handleBraintreePayment(payload.nonce);
              })
              .catch((err) => {
                // Handle errors in requesting payment method
              });
            console.log('click event');
          });
        });
    });
  }

  send() {
    console.log('oh yeah!');
  }

  handleBraintreePayment(nonce) {
    const payableAmount = '10';
    const allValues = Object.assign({payableAmount},{nonce});

    this.checkoutService.checkOut(allValues).subscribe((resp: any)=>{
    console.log(resp);

    });
  }
}
