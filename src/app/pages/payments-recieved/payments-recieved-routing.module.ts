import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentsRecievedPage } from './payments-recieved.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsRecievedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRecievedPageRoutingModule {}
