import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from '../Table/table';
import {TableService} from "../Table/table.service";
import {SocketioService} from "../Socketio/socketio.service";
import {UserService} from "../User/user.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-waiter',
  template: `
    <div class="container" style="width: 900px; margin-top: 20px; ">
      <h2 class="text-center m-5">Tables List</h2>

      <table class="table table-striped table-bordered" style="background: #ffffff;">
        <thead>
        <tr>
          <th>Table number</th>
          <th>Seats</th>
          <th>State</th>
          <th>Actions</th>
        </tr>
        </thead>

        <tbody>
        <tr *ngFor="let table of tables">
          <td>{{table.number}}</td>
          <td>{{table.seats}}</td>
          <td *ngIf="table.isFree == false">Occupied</td>
          <td *ngIf="table.isFree == false">
            <button *ngIf="table.waiter==getEmail()" class="btn btn-info"
                    [routerLink]="['/menu', {'number': table.number}]">Add order
            </button>
            &nbsp;
            <button *ngIf="table.waiter==getEmail()" class="btn btn-primary"
                    [routerLink]="['/orders', {'number': table.number}]">Orders status
            </button>
          </td>
          <td *ngIf="table.isFree == true">Free</td>
          <td *ngIf="table.isFree == true">
            <button class="btn btn-warning" (click)="occupyTable(table.number)">Occupy table</button> &nbsp;
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  `
})
export class WaiterComponent implements OnInit {
  tables: Table[] = [];
  notifications: string[] = [];
  constructor(private tablesService: TableService,
              private socketService: SocketioService,
              private userService: UserService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    if(this.userService.getRole() != 'Waiter')
      this.router.navigate(['/']);
    this.fetchTables();
    this.socketService.connectTables().subscribe((m)=>{
      this.fetchTables();
    });
    this.socketService.connectQueue(true).subscribe((m)=>{
      this.toastr.success( m);
    });
  }

  getEmail(){
    return this.userService.getEmail();
  }

  private fetchTables(): void {
    this.tablesService.getTables().subscribe({
      next: (tables) => {
        console.log('Tables retrieved');
        this.tables = tables as Table[];
      },
      error: (err) => {
        console.log('Error retrieving tables from DB: ' + JSON.stringify(err));
      }
    });
  }
  occupyTable(number: any): void {
    this.tablesService.occupyTable(number,this.userService.getEmail() ).subscribe({
      next: (str) => console.log('Ok table '+number+' occupied'),
      error: (err) => console.log('Error occupying table: ' + JSON.stringify(err))
    });
  }
}
