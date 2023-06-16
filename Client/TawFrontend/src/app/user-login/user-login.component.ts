import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserService} from "../User/user.service";
import {Auth} from "../Auth/auth";
import {HomeComponent} from "../home/home.component";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-login-user',
  templateUrl: 'user-login.component.html',
  styleUrls: ['user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private router: Router, private userService: UserService, private home: AppComponent) {
  }

  ngOnInit(): void {
    // check if the user is already logged in
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  login(email: string, password: string, remember: boolean) {
    let curUser: Auth = {
      email: email,
      password: password
    }
    this.userService.signIn(curUser, remember).subscribe({
      next: (res) => {
        console.log('You are logged in, response: ' + JSON.stringify(res));
        alert(localStorage.getItem('auth_jwt'));

        this.home.navToHome();
      },
      error: (err) => {
        if(err.status==401){
          alert("Invalid user credentials!");
        }
      }
    });
  }

  navToSignUp() {
    this.router.navigate(['/signup']);
  }
}
