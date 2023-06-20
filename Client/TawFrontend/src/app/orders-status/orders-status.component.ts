import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Queue_Item } from '../Queue/queue_item';
import {TableService} from "../Table/table.service";
import {SocketioService} from "../Socketio/socketio.service";
import {UserService} from "../User/user.service";
import {QueueService} from "../Queue/queue.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-orders-status',
  template: `
      <div class="container" style="width: 900px; margin-top: 20px;">
          <h2 class="text-center m-5">Table {{table_number}} orders status</h2>

          <table class="table table-striped table-bordered">
              <thead>
              <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Timestamp</th>
                  <th>Status</th>
              </tr>
              </thead>

              <tbody>
              <tr *ngFor="let item of items">
                  <td>{{item.name}}</td>
                  <td>{{item.type}}</td>
                  <td>{{item.timestamp | date:'short'}}</td>
                  <td>
                    <div *ngIf="item.status=='Pending'">Pending
                    </div>
                    <div *ngIf="item.status=='Ready'">Ready
                    </div>
                    <div *ngIf="item.status=='Preparing'">Preparing
                    </div>
                  </td>
              </tr>
              </tbody>
          </table>
      </div>
  `
})
export class ordersStatusComponent implements OnInit {
  items: Queue_Item[] = [];

  table_number :any;
  constructor(private tablesService: TableService,
              private socketService: SocketioService,
              private queueService: QueueService,

              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {
    if(this.userService.getRole() != 'Waiter')
      this.router.navigate(['/']);
    this.route.paramMap.subscribe(params => {
      this.table_number = params.get('number');
    });
    this.fetchItems();
    this.socketService.connectQueue().subscribe((m)=>{
      this.fetchItems();
    })
  }

  private fetchItems(): void {
    this.queueService.getTableItems(this.table_number).subscribe({
      next: (items) => {
        console.log('table items retrieved');
        this.items = items as Queue_Item[];
      },
      error: (err) => {
        console.log('Error retrieving table items from DB: ' + JSON.stringify(err));
      }
    });
  }
}
