import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoversComponent } from '../../popovers/popovers.component'

type Option = {
  answer: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  options: Option[];
};

type TransformedStructure = { [key: string]: Question };

@Component({
  selector: 'app-mcq-questions',
  templateUrl: './mcq-questions.page.html',
  styleUrls: ['./mcq-questions.page.scss'],
})
export class McqQuestionsPage implements OnInit {

  constructor(public popoverController: PopoverController,private route: ActivatedRoute, public toastController: ToastController, private alertController: AlertController, private navCtrl: NavController, private router: Router, private navController: NavController) { 
    this.route.queryParams.subscribe(params => {
      this.ngOnInit();
    })
  }

  index: number = 0;
  score: number = 0;
  message : string = "";
  selectedOption: string = "";
  questions: Question[] = [];
  subject : string = "";

  ngOnInit() {
    this.index = 0;
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      const quizData = navigation.extras.state['data']?.['quizdata']?.['data']?.['mcqs'];
      this.subject = navigation.extras.state['data']['subject'];
      if (Array.isArray(quizData)) {
        const flattenedQuestions = quizData.reduce((acc, curr) => acc.concat(curr), []);
        this.questions = flattenedQuestions; //.slice(0, 10);
      } else {
        console.error('Quiz data is not an array or is undefined:', quizData);
      }
    } else {
      console.error('Navigation extras state is not available');
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
  

  getCurrentQuestion() {
    return this.questions[this.index];
  }

  nextQuestion() {    
    if (!this.selectedOption) {
      this.presentToast('Please select an option before proceeding.');
      return; // Exit the method to prevent moving to the next question
    }    
    const currentQuestion = this.getCurrentQuestion();    
    if (this.selectedOption) {
      const selectedOption = currentQuestion.options.find(option => option.answer === this.selectedOption);  
      if (selectedOption && selectedOption.isCorrect) {
        this.score++;
      }
    }
  
    if (this.index < this.questions.length - 1) {
      this.index++;
      this.selectedOption = ''; // Reset selected option
    }
  }


  submitAnswers() {
    const currentQuestion = this.getCurrentQuestion();
    if (this.selectedOption) {
      const selectedOption = currentQuestion.options.find(option => option.answer === this.selectedOption);
      if (selectedOption && selectedOption.isCorrect) {
        this.score++;
      }
    }
    const storedScoresString = localStorage.getItem('subjectScores');
    const storedScores = storedScoresString ? JSON.parse(storedScoresString) : {
      Science: null,
      SocialScience: null,
      mathematics: null
    };
    const previousScore = storedScores[this.subject];
    if (this.subject === 'Science') {
      storedScores.Science = this.score;
    } else if (this.subject === 'SocialScience') {
      storedScores.SocialScience = this.score;
    } else if (this.subject === 'mathematics') {
      storedScores.mathematics = this.score;
    }
    localStorage.setItem('subjectScores', JSON.stringify(storedScores));
    if (this.score !== previousScore) {
      if (this.score <= 3) {
        this.message = "Don't worry, you're off to a good start! Keep practicing and you'll improve.";
      } else if (this.score >= 4 && this.score <= 7) {
        this.message = "Great effort! You're getting there, keep up the good work!";
      } else if (this.score >= 8 && this.score <= 10) {
        this.message = "Excellent work! You're mastering this, keep it up!";
      }
    }
    const dataToSend = {
      score: this.score,
      totalQuestion: this.questions.length,
      message: this.message,
      subject: this.subject,
    };
    this.navController.navigateForward('/score', {
      state: {
        data: dataToSend
      },
      replaceUrl: true
    });
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
