import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../User/user.service";
import {User} from "../User/user";
@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent {

  constructor(private router: Router, public userService: UserService) {}
  ngOnInit(): void {
    if (this.userService.getRole() != 'Cashier')
      this.router.navigate(['/']);
  }
  signUp(email: string, password: string, username: string, role: string){
    if(email == '' || password == '' || username == '' || role == ''){
      alert('Params are not correct');
      return;
    }
    const user: User = {
      email: email,
      password: password,
      username: username,
      role: role
    };
    return this.userService.createUser(user).subscribe({
      next: (res) => {
        console.log('User signed up, res: ' + JSON.stringify(res));
        this.router.navigate(['/userslist']);
      },
      error: (err) => {
        if(err.status==403){
          alert("User already exists!");
        }
        console.log('Sign up error: ' + JSON.stringify(err));
      }
    });
  }
}
