/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CheckoutService } from 'src/app/services/Checkout/checkout.service';
import { ProductsService } from 'src/app/services/product/products.service';
import { TokenService } from 'src/app/services/Token/token.service';
import { v4 as uuidv4 } from 'uuid';

declare const braintree;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  totalCart: any;
  products: any;
  cart: {
    id: any;
    productName: any;
    price: any;
    quantity: number;
    itemTotal: number;
  }[];

  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController,
    private tokenService: TokenService,
    private productService: ProductsService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    // this.handleBraintreePayment('any');
  }

  async ngOnInit() {
    // get token first thing when page loads
    await this.getProducts();
    // Hide purchase button on page load
    (document.getElementById('purchase') as any).style.visibility = 'hidden';
  }
  ionViewDidEnter() {
    this.getToken();
  }

  async getToken() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Please wait...',
    });
    await loading.present();
    const purchase = document.querySelector('#purchase');
    // this.getProducts();

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
            amount: this.totalCart,
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
        .then(async (dropinInstance) => {
          

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

          // Paypal payment logic
          dropinInstance.on('paymentMethodRequestable', (event) => {
            console.log('paypal event', event);
            if (
              event.paymentMethodIsSelected === true &&
              event.type === 'PayPalAccount'
            ) {
              dropinInstance.requestPaymentMethod().then((payload) => {
                console.log('payload', payload);

                this.handleBraintreePayment(payload, dropinInstance);
              });
            }
          });

          // card payment logic
          purchase.addEventListener('click', () => {
            dropinInstance
              .requestPaymentMethod()
              .then((payload) => {
                console.log('payload', payload);
                this.handleBraintreePayment(payload, dropinInstance);
              })
              .catch((err) => {
                // Handle errors in requesting payment method
              });
            console.log('click event');
          });
        });
    });
  }

  async handleBraintreePayment(payload, dropinInstance) {
    //to simulate success or fail Change amount
    // see https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live

    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Please wait...',
    });
    await loading.present();

    // Creating the object to send to the server
    const payableAmount = (this.totalCart.toFixed(2)).toString();
    const nonce = payload.nonce;
    const billing = payload.details;
    const type = payload.type;
    const products = this.cart;
    const allValues = Object.assign(
      { payableAmount },
      { nonce },
      { billing },
      { type },
      { products }
    );
    console.log('allV', allValues);

    // Disable the purchase button when sending to server
    (document.getElementById('purchase') as any).disabled = true;

    // Actual function that receives allValues Object created to send to server
    this.checkoutService.checkOut(allValues).subscribe((resp: any) => {
      console.log(resp);
      if (resp.success === true) {
        this.successfulToast();
        dropinInstance.teardown((teardownErr) => {
          if (teardownErr) {
            console.error('Could not tear down Drop-in UI!');
            loading.dismiss();
          } else {
            (document.getElementById('purchase') as any).remove();
            loading.dismiss();
            this.router.navigate([
              '/payments-recieved',
              { paymentDetails: JSON.stringify(resp.transaction) },
            ]);
          }
        });
      } else if (resp.success === false) {
        this.errorToast();
        loading.dismiss();
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

  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      console.table('dummy products', this.products);

      // Random products
      this.cart = [
        {
          id: this.products[0].id,
          productName: this.products[0].title,
          price: this.products[0].price,
          quantity: 2,
          itemTotal: this.products[0].price * 2,
        },
        {
          id: this.products[1].id,
          productName: this.products[1].title,
          price: this.products[1].price,
          quantity: 6,
          itemTotal: this.products[1].price * 6,
        },
        {
          id: this.products[2].id,
          productName: this.products[2].title,
          price: this.products[2].price,
          quantity: 3,
          itemTotal: this.products[2].price * 3,
        },
      ];

      this.totalCart = this.cart
        .map((item) => item.itemTotal)
        .reduce((a, b) => a + b, 0);

      // console.log('cart', typeof this.totalCart);
      // this.getToken();
    });
  }
}
