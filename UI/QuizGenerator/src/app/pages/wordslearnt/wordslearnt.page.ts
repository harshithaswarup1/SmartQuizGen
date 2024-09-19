import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoversComponent } from '../../popovers/popovers.component'

@Component({
  selector: 'app-wordslearnt',
  templateUrl: './wordslearnt.page.html',
  styleUrls: ['./wordslearnt.page.scss'],
})
export class WordslearntPage implements OnInit {
  wordslearnt : number = 0;
  subject : string = "";

  subjects: Array<{ name: string; wordslearnt?: number; totalWords?: number; message?: string }> = [
    { name: 'Science', totalWords: 100 },  // Example totalWords; adjust as needed
    { name: 'SocialScience', totalWords: 100 },
    { name: 'mathematics', totalWords: 100 }
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
  
    // Check if the data is passed through navigation state
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { data: { wordslearnt: number; subject: string } };
      if (state) {
        this.wordslearnt = state.data.wordslearnt;
        this.subject = state.data.subject;
      }
    }
  
    // Retrieve the subject words learned from localStorage
    const storedWordsString = localStorage.getItem('subjectWordsLearned');
    const storedWords = storedWordsString ? JSON.parse(storedWordsString) : {
      Science: undefined,
      SocialScience: undefined,
      mathematics: undefined
    };
  
    // Initialize subjects with undefined words learned
    this.subjects.forEach(subject => {
      subject.wordslearnt = undefined; // Ensure words learned can be undefined
    });
  
    // Update the words learned for the selected subject
    this.subjects.forEach(subject => {
      if (subject.name === this.subject) {
        subject.wordslearnt = this.wordslearnt;
      } else {
        // Set words learned from localStorage for other subjects
        if (subject.name === 'Science') {
          subject.wordslearnt = storedWords.Science;
        } else if (subject.name === 'SocialScience') {
          subject.wordslearnt = storedWords.SocialScience;
        } else if (subject.name === 'mathematics') {
          subject.wordslearnt = storedWords.mathematics;
        }
      }
    });
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

  startNewQuiz() {
    this.router.navigate(['/quiztypeselection']);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  logout() {
    this.alertController.create({
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
            this.router.navigate(['/home'], { replaceUrl: true });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

}
