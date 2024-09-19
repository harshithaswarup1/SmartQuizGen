import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service'

@Component({
  selector: 'app-popovers',
  templateUrl: './popovers.component.html',
  styleUrls: ['./popovers.component.scss'],
})
export class PopoversComponent  implements OnInit {

  constructor(private api: ApiService) { }

  username : string = "";
  email : string  = "";

  ngOnInit() {
    const usernameFromStorage = this.api.getUserName();
    this.username = usernameFromStorage ? usernameFromStorage : 'Guest'; // Provide a default value
    this.email = this.username + '@gmail.com'
  }

}
