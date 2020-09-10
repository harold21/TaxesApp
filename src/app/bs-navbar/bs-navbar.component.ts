import { Component, OnInit } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit {

  userName$: string;

  constructor(public adalService: MsAdalAngular6Service) { }

  ngOnInit(): void {
    if (this.adalService.userInfo) {
      this.userName$ = this.adalService.userInfo.userName;
    } else {
      this.userName$ = '';
    }
  }

  logIn(): void {
    this.adalService.login();
  }

  logOut(): void {
    this.adalService.logout();
  }

}
