import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WordslearntPage } from './wordslearnt.page';

const routes: Routes = [
  {
    path: '',
    component: WordslearntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WordslearntPageRoutingModule {}
