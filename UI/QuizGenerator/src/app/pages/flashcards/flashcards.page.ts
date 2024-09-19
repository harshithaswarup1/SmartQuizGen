import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { PopoversComponent } from '../../popovers/popovers.component';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.page.html',
  styleUrls: ['./flashcards.page.scss'],
})
export class FlashcardsPage implements OnInit {
  flashcards: Array<{ title: string; description: string; known: boolean; flipped: boolean }> = [];
  showDescription = false; // Track if the description is shown
  index = 0; // Track the current card index
  knownWordsCount = 0; // Count of known words
  subject!: string; // Subject from navigation extras (use non-null assertion operator)
  message: string = "";
  progress : number = 0;
  totallen : number = 0;
  

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
    this.index = 0;
    const navigation = this.router.getCurrentNavigation();  
    if (navigation?.extras.state) {
      const quizData = navigation.extras.state['data']?.['quizdata']?.['data'];
      this.subject = navigation.extras.state['data']['subject'];
      if (Array.isArray(quizData)) {
          const flattenedCards = quizData.reduce((acc, curr) => acc.concat(curr), []);
          this.totallen = flattenedCards.length;
          this.flashcards = flattenedCards.flatMap((item: any) => {
          return Object.entries(item).map(([title, description]: [string, any]) => ({
              title: title as string,
              description: description as string,
              flipped: false 
            }));
          });
          this.flashcards.forEach(card => {
            card.known = false;
          });
          console.log(this.flashcards)
      } 
      else {
        console.error('Quiz data is not an array or is undefined:', quizData);
      }
    } 
    else {
      console.error('Navigation extras state is not available');
    }
  }
  
  toggleDescription(index: number) {
    this.flashcards[index].flipped = !this.flashcards[index].flipped;
  }

  startNewQuiz() {
    this.router.navigate(['/quiztypeselection']);
  }
  
  markAsLearning(index:any) {
    if (this.flashcards.length > 0 && !this.flashcards[this.index].known) {
      this.flashcards[this.index].known = true;
      this.flashcards.shift(); 
      this.showDescription = false; 
      if (this.flashcards.length > 0) {
        this.index = 0;
      } else {
        console.log('No more cards left');
      }
    }
  }

  markAsKnown(index:any) {
    if (this.flashcards.length > 0 && !this.flashcards[this.index].known) {
      this.flashcards[this.index].known = true; // Mark card as known
      this.knownWordsCount++;
      this.flashcards.shift(); // Remove the current card
      this.showDescription = false; // Hide description for the next card
      if (this.flashcards.length > 0) {
        this.index = 0; // Reset index to 0 for the new first card
      } else {
        console.log('No more cards left');
      }
      this.updateProgress();
    }
  }

  updateProgress() {
    this.knownWordsCount = this.knownWordsCount;
    this.progress = (this.knownWordsCount / this.flashcards.length) * 100;
  }

  done() {
    const storedWordsString = localStorage.getItem('subjectWordsLearned');
    const storedWords = storedWordsString ? JSON.parse(storedWordsString) : {
      Science: null,
      SocialScience: null,
      mathematics: null
    };
    const previousWordsCount = storedWords[this.subject];
    if (this.subject === 'Science') {
      storedWords.Science = this.knownWordsCount;
    } else if (this.subject === 'SocialScience') {
      storedWords.SocialScience = this.knownWordsCount;
    } else if (this.subject === 'mathematics') {
      storedWords.mathematics = this.knownWordsCount;
    }
    localStorage.setItem('subjectWordsLearned', JSON.stringify(storedWords));
    if (this.knownWordsCount !== previousWordsCount) {
      if (this.knownWordsCount <= 3) {
        this.message = "Keep going, you're just getting started!";
      } else if (this.knownWordsCount >= 4 && this.knownWordsCount <= 7) {
        this.message = "Nice progress! You're learning a lot!";
      } else if (this.knownWordsCount >= 8) {
        this.message = "Fantastic! You've learned a lot of words!";
      }
    }
  
    const dataToSend = {
      wordslearnt: this.knownWordsCount,
      subject: this.subject,
      message: this.message,
    };
  
    this.navController.navigateForward('/wordslearnt', {
      state: {
        data: dataToSend
      },
      replaceUrl: true
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

  prevpage() {
    let dataToSend = {
      quiztype: { "quiztype": "2" }
    };
    this.navController.navigateForward('/subject-selection-page', {
      state: {
        data: dataToSend
      }, replaceUrl: true
    });
  }

  logout() {
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
