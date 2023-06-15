import {Component, Injectable, OnInit} from '@angular/core';
import {UserService} from "../User/user.service";
import {Router} from "@angular/router";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  constructor(private userService: UserService, private home: AppComponent) {}

  ngOnInit(): void {
    if(this.userService.isLoggedIn())
      this.home.navToHome();
  }

}
