import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubjectSelectionPagePage } from './subject-selection-page.page';

const routes: Routes = [
  {
    path: '',
    component: SubjectSelectionPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectSelectionPagePageRoutingModule {}
