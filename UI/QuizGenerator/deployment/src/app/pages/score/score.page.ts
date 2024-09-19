import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoversComponent } from '../../popovers/popovers.component'

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {

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

  score: number = 0;
  totalques: number = 0;
  message: string = "";
  subject: string = "";

  subjects: Array<{ name: string; score?: number; totalques: number; message?: string }> = [
    { name: 'Science', totalques: 10 },
    { name: 'SocialScience', totalques: 10 },
    { name: 'mathematics', totalques: 10 }
  ];

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { data: { score: number; totalQuestion: number; message: string; subject: string } };
      if (state) {
        this.score = state.data.score;
        this.totalques = state.data.totalQuestion;
        this.message = state.data.message;
        this.subject = state.data.subject;
      }
    }
    const storedScoresString = localStorage.getItem('subjectScores');
    const storedScores = storedScoresString ? JSON.parse(storedScoresString) : {
      Science: undefined,
      SocialScience: undefined,
      mathematics: undefined
    };
    this.subjects.forEach(subject => {
      subject.score = undefined; // Ensure score can be undefined
      subject.message = undefined; // Ensure message can be undefined
    });
    this.subjects.forEach(subject => {
      if (subject.name === this.subject) {
        subject.score = this.score;
        subject.totalques = this.totalques;
        subject.message = this.message;
      } else {
        if (subject.name === 'Science') {
          subject.score = storedScores.Science;
        } else if (subject.name === 'SocialScience') {
          subject.score = storedScores.SocialScience;
        } else if (subject.name === 'mathematics') {
          subject.score = storedScores.mathematics;
        }
        if (subject.score !== undefined) {
          if (subject.score < 3) {
            subject.message = "Don't worry, you're off to a good start! Keep practicing and you'll improve.";
          } else if (subject.score >= 4 && subject.score <= 7) {
            subject.message = "Great effort! You're getting there, keep up the good work!";
          } else if (subject.score >= 8 && subject.score <= 10) {
            subject.message = "Excellent work! You're mastering this, keep it up!";
          }
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

  formatSubjectName(name: string): string {
    if (name === "SocialScience") {
      return "Social Science";
    } else if (name === "mathematics") {
      return "Mathematics"; // No change for this case, but you can format it as needed
    }
    return name; // Return other subject names unchanged
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
