import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonInput } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import {SubjectSelectionPagePage} from '../../pages/subject-selection-page/subject-selection-page.page';
import {QuiztypeselectionPage} from '../../pages/quiztypeselection/quiztypeselection.page'
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private api: ApiService,private router: Router,public toastController: ToastController,private navCtrl: NavController) {}

  ngOnInit(): void {}

  onLogin() {
    
    if (this.email && this.password) {
      this.api.setUserName(this.email)
      this.router.navigate(['/quiztypeselection']);
    } else {
      this.presentToast('Please enter username and password!');
    }
  }
  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, 
      position: 'top'
    });
    toast.present();
  }

}
