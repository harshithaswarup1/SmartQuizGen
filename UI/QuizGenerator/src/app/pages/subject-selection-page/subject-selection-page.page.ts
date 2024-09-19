import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import {QuiztypeselectionPage} from '../../pages/quiztypeselection/quiztypeselection.page'
import { PopoverController } from '@ionic/angular';
import { PopoversComponent } from '../../popovers/popovers.component'

@Component({
  selector: 'app-subject-selection-page',
  templateUrl: './subject-selection-page.page.html',
  styleUrls: ['./subject-selection-page.page.scss'],
})
export class SubjectSelectionPagePage implements OnInit {

  subjects = [
    { id: 1, name: 'Science'},
    { id: 2, name: 'Social Science'},
    { id: 3, name: 'Mathematics'},
    // Add more subjects as needed
  ];

  constructor(public popoverController: PopoverController,private route: ActivatedRoute,private api: ApiService,private alertController: AlertController,private navCtrl: NavController,private router: Router,private navController: NavController) {
    this.route.queryParams.subscribe(params => {
      this.ngOnInit();
    })
  }

  subject : string = "";
  selectedsubject : string = "";
  quiztype : string = "";
  selectedquiztype : string = "";
  

  ngOnInit() {
    
    this.selectedquiztype = "";
    this.selectedsubject  = "";
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.selectedquiztype = navigation?.extras.state['data']['quiztype']['quiztype']
      if (this.selectedquiztype == '1'){
        this.selectedquiztype = 'MCQ'
        
      }
      if (this.selectedquiztype == '2'){
        this.selectedquiztype = 'FlashCards'
      }
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

  selectedSubject(subjectId: number) {
    
    if (subjectId == 1){
      this.selectedsubject = "Science";
    }
    if (subjectId == 2){
      this.selectedsubject = "SocialScience";
    }
    if (subjectId == 3){
      this.selectedsubject = "mathematics";
    }
    this.getquizData()    
  }

  getquizData() {
    this.api.showLoader();
    this.api.generateQuiz(this.selectedsubject, this.selectedquiztype).subscribe(
      (res: any) => {
        this.api.hideLoader();
        let dataToSend = {}
        dataToSend = {
          quiztype: this.selectedquiztype,
          quizdata: { data: res },
          subject : this.selectedsubject,
          
        };
        if (this.selectedquiztype === 'MCQ') {
          this.navController.navigateForward('/mcq-questions', {
            state: {
              data: dataToSend
            },
            replaceUrl: true
          });
        } else if (this.selectedquiztype === 'FlashCards') {
          this.navController.navigateForward('/difficultylevel', {
            state: {
              data: dataToSend
            },
            replaceUrl: true
          });
        }
      },
      (error) => {
        console.error('Error generating quiz:', error);
        this.api.hideLoader();
      }
    );
  }
  
  prevpage(){
    this.router.navigate(['/quiztypeselection']);  
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
