import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoversComponent } from '../../popovers/popovers.component'


@Component({
  selector: 'app-quiztypeselection',
  templateUrl: './quiztypeselection.page.html',
  styleUrls: ['./quiztypeselection.page.scss'],
})
export class QuiztypeselectionPage implements OnInit {

  qiztype = [
    { id: 1, name: 'MCQ'},
    { id: 2, name: 'Flashcards'},
  ];

  constructor(public popoverController: PopoverController,private alertController: AlertController,private navCtrl: NavController,private router: Router,private navController: NavController) {}

  ngOnInit() {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoversComponent,
      cssClass: 'my-header-popover',
      event: ev,
      translucent: true,
    });
    await popover.present();
    const { role } = await popover.onDidDismiss();
  }

  selectedQuiz(quiztype: number) {    
    let dataToSend = {
      quiztype : {"quiztype":quiztype} 
     };
     this.navController.navigateForward('/subject-selection-page', {
       state: {
         data: dataToSend
       },replaceUrl: true
     });
  }

  logout(){
    let alert = this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Logout cancelled');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('User confirmed logout');
            localStorage.clear();
            const currentRoute = this.router.url;
  
  
              if (currentRoute !== '/home') {
                this.router.navigate(['/home'], { replaceUrl: true });
              }
          }
        }
      ]
    }).then(alert => {
      alert.present();
      alert.onDidDismiss().then((data) => {
        if (data.role !== 'cancel') {
        }
      });
    });
  }
}
