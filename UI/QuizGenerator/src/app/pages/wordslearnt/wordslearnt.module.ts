import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WordslearntPageRoutingModule } from './wordslearnt-routing.module';

import { WordslearntPage } from './wordslearnt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WordslearntPageRoutingModule
  ],
  declarations: [WordslearntPage]
})
export class WordslearntPageModule {}
