import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DifficultylevelPageRoutingModule } from './difficultylevel-routing.module';

import { DifficultylevelPage } from './difficultylevel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DifficultylevelPageRoutingModule
  ],
  declarations: [DifficultylevelPage]
})
export class DifficultylevelPageModule {}
