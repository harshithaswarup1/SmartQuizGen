import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'http://localhost:5000'; 
  private apiUrl = 'https://smartquizgenbackend.azurewebsites.net' // Replace with your API URL

  constructor(private http: HttpClient) { }

  public isLoading=false;

  showLoader(){
    this.isLoading=true;
  }

  hideLoader(){
    setTimeout(() => {
      this.isLoading=false;
    },200)
  }

  

  generateQuiz(subject: string, quizType: string): Observable<any> {
    
    let options = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // Include subject and quizType as query parameters in the URL
    return this.http.get<any>(`${this.apiUrl}/generate-quiz?subject=${subject}&quizType=${quizType}`, options);
  }

  setUserName(username: string) {
    if (username) {
      window.localStorage.setItem('username', username);
    }
  }

  getUserName() {
    return window.localStorage.getItem('username');
  }
  
  
  
  }

