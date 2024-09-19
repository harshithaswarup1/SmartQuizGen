import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { McqQuestionsPageRoutingModule } from './mcq-questions-routing.module';

import { McqQuestionsPage } from './mcq-questions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    McqQuestionsPageRoutingModule
  ],
  declarations: [McqQuestionsPage]
})
export class McqQuestionsPageModule {}
