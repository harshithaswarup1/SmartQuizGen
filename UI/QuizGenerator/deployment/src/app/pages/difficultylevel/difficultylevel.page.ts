import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoversComponent } from '../../popovers/popovers.component';

@Component({
  selector: 'app-difficultylevel',
  templateUrl: './difficultylevel.page.html',
  styleUrls: ['./difficultylevel.page.scss'],
})
export class DifficultylevelPage implements OnInit {

  subject: string = '';
  quizData : any = [];

  qiztype = [
    { id: 1, name: 'Basic'},
    { id: 2, name: 'Medium'},
    { id: 3, name: 'Hard'},
  ];


  constructor(
    public popoverController: PopoverController,
    private route: ActivatedRoute,
    public toastController: ToastController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private navController: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      this.ngOnInit();
    });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.quizData = navigation.extras.state['data']?.['quizdata']?.['data']?.['flashcards'];
      this.subject = navigation.extras.state['data']['subject'];
    }
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
      quizdata: { data: this.quizData },
      subject : this.subject,
     };
     this.navController.navigateForward('/flashcards', {
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
