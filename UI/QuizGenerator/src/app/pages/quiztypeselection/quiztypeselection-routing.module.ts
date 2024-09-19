import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuiztypeselectionPage } from './quiztypeselection.page';

const routes: Routes = [
  {
    path: '',
    component: QuiztypeselectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuiztypeselectionPageRoutingModule {}
