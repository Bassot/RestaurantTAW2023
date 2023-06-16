import {Component, OnInit} from '@angular/core';
import {UserService} from "../User/user.service";
import {User} from "../User/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit{
  users: User[] = [];
  visualizeOptions: boolean[] = [];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if (this.userService.getRole() != 'Cashier')
      this.router.navigate(['/']);
    this.getUsers();
  }
  getUsers(){
    this.userService.getUsers().subscribe({
      next:(data)=>{
        console.log('Users retreived');
        this.users = data;
      },
      error:(err) => console.log('Error getting users: '+JSON.stringify(err))
    });
  }
  deleteUser(email: string){
    if(confirm('Do you really want to delete '+email+' ?')){
      this.userService.deleteUser(email).subscribe({
        next:(data)=>{
          console.log('User deleted');
          this.getUsers();
          },
        error:(err) => console.log('Error deleting user: '+JSON.stringify(err))
      });
    }
  }
  navToSignUp(){
    this.router.navigate(['/signup']);
  }
}
