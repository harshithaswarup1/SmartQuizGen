import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { McqQuestionsPage } from './mcq-questions.page';

const routes: Routes = [
  {
    path: '',
    component: McqQuestionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class McqQuestionsPageRoutingModule {}
