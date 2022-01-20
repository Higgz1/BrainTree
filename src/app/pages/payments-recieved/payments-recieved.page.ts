import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payments-recieved',
  templateUrl: './payments-recieved.page.html',
  styleUrls: ['./payments-recieved.page.scss'],
})
export class PaymentsRecievedPage implements OnInit {
  paymentDetails: any;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.paymentDetails = JSON.parse(this.route.snapshot.paramMap.get('paymentDetails'));
   }

  ngOnInit() {
  }

  ionViewDidEnter() {
    console.log('payment Details',this.paymentDetails);
  }

}
