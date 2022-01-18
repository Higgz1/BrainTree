import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { TokenService } from 'src/app/services/Token/token.service';

declare const braintree;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
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
      spinner: 'crescent',
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
          //example paypal integration
          paypal: {
            flow: 'checkout',
            amount: '10.00',
            currency: 'USD',
            onSuccess: (nonce) => {
              console.log('nonce', nonce);
            },
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

          dropinInstance.on('paymentMethodRequestable', (event) => {
            console.log('paypal event', event);
            if (
              event.paymentMethodIsSelected === true &&
              event.type === 'PayPalAccount'
            ) {
              dropinInstance.requestPaymentMethod().then((payload) => {
                this.handleBraintreePayment(payload.nonce, dropinInstance);
              });
            }
          });

          purchase.addEventListener('click', () => {
            dropinInstance
              .requestPaymentMethod()
              .then((payload) => {
                // console.log('payload', payload.nonce);
                this.handleBraintreePayment(payload.nonce, dropinInstance);
              })
              .catch((err) => {
                // Handle errors in requesting payment method
              });
            console.log('click event');
          });
        });
    });
  }

  handleBraintreePayment(nonce, dropinInstance) {
    //to simulate success or fail Change amount
    // see https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live

    const payableAmount = '100';
    const allValues = Object.assign({ payableAmount }, { nonce });
    (document.getElementById('purchase') as any).disabled = true;

    this.checkoutService.checkOut(allValues).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success === true) {
        this.successfulToast();
        dropinInstance.teardown((teardownErr) => {
          if (teardownErr) {
            console.error('Could not tear down Drop-in UI!');
          } else {
            (document.getElementById('purchase') as any).remove();
          }
        });
      } else if (resp.success === false) {
        this.errorToast();
        (document.getElementById('purchase') as any).disabled = false;
      }
    });
  }

  async successfulToast() {
    const toast = await this.toastController.create({
      message: 'Transaction Successfull',
      duration: 3000,
    });
    toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Transaction Failed',
      duration: 3000,
    });
    toast.present();
  }
}
