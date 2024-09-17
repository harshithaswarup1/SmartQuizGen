import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubjectSelectionPagePageRoutingModule } from './subject-selection-page-routing.module';

import { SubjectSelectionPagePage } from './subject-selection-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubjectSelectionPagePageRoutingModule
  ],
  declarations: [SubjectSelectionPagePage]
})
export class SubjectSelectionPagePageModule {}
