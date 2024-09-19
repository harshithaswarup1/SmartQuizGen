import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'subject-selection-page',
    loadChildren: () => import('./pages/subject-selection-page/subject-selection-page.module').then( m => m.SubjectSelectionPagePageModule)
  },
 
  {
    path: 'quiztypeselection',
    loadChildren: () => import('./pages/quiztypeselection/quiztypeselection.module').then( m => m.QuiztypeselectionPageModule)
  },
  {
    path: 'mcq-questions',
    loadChildren: () => import('./pages/mcq-questions/mcq-questions.module').then( m => m.McqQuestionsPageModule)
  },
  {
    path: 'flashcards',
    loadChildren: () => import('./pages/flashcards/flashcards.module').then( m => m.FlashcardsPageModule)
  },
 
  {
    path: 'score',
    loadChildren: () => import('./pages/score/score.module').then( m => m.ScorePageModule)
  },
  {
    path: 'wordslearnt',
    loadChildren: () => import('./pages/wordslearnt/wordslearnt.module').then( m => m.WordslearntPageModule)
  },
  {
    path: 'difficultylevel',
    loadChildren: () => import('./pages/difficultylevel/difficultylevel.module').then( m => m.DifficultylevelPageModule)
  },
 
  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
