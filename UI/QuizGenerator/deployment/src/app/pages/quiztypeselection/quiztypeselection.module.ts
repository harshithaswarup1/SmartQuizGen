import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuiztypeselectionPageRoutingModule } from './quiztypeselection-routing.module';

import { QuiztypeselectionPage } from './quiztypeselection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuiztypeselectionPageRoutingModule
  ],
  declarations: [QuiztypeselectionPage]
})
export class QuiztypeselectionPageModule {}
