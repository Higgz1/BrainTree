import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsRecievedPageRoutingModule } from './payments-recieved-routing.module';

import { PaymentsRecievedPage } from './payments-recieved.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsRecievedPageRoutingModule
  ],
  declarations: [PaymentsRecievedPage]
})
export class PaymentsRecievedPageModule {}
