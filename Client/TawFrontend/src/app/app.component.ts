import {Component, Injectable, OnInit} from '@angular/core';
import {UserService} from "./User/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {
  title = 'TawFrontend';
  loginNav: string = '';

  constructor(public userService: UserService, private router: Router) {}

  navToLogin(){
    this.router.navigate(['/login']);
  }

  navToSignup(){
    this.router.navigate(['/signup']);
  }



  logout(){
    this.userService.logOut();
    this.router.navigate(['/']);
  }
  navToHome() {
    if (this.userService.isLoggedIn()) {
      console.log('Role: ' + this.userService.getRole());
      switch (this.userService.getRole()) {
        case 'Waiter':
          this.router.navigate(['/waiters']);
          break;
        case 'Cook':
          this.router.navigate(['/cooks']);
          break;
        case 'Bartender':
          this.router.navigate(['/bartenders']);
          break;
        case 'Cashier':
          this.router.navigate(['/cashiers']);
          break;
        default:
          console.log("%cError loading role in jwt", "color:red");
      }
    }
    else{
      this.router.navigate(['/']);
    }
  }
}
