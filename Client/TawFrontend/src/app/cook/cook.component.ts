import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Table} from "../Table/table";
import {TableService} from "../Table/table.service";
import {QueueService} from "../Queue/queue.service";
import {Queue_Item} from "../Queue/queue_item";
import {SocketioService} from "../Socketio/socketio.service";
import {UserService} from "../User/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cook',
  templateUrl: './cook.component.html',
  styleUrls: ['./cook.component.css']
})
export class CookComponent implements OnInit {
  itemsInQueue: Queue_Item[] = [];
  tables: Table[] = [];
  constructor(private queueService: QueueService,
              private tablesService: TableService,
              private socketService: SocketioService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    if(this.userService.getRole() != 'Cook')
      this.router.navigate(['/']);
    this.refreshQueue();
    this.socketService.connectQueue().subscribe((m) => {
      this.refreshQueue();
    })
  }

  refreshQueue() {
    this.tablesService.getTables().subscribe({
      next: (tables) => {
        console.log('Tables retrieved');
        this.tables = tables as Table[];

        // retreiveng items data
        this.queueService.getAllDishes().subscribe({
          next: (items) => {
            console.log('Items in queue retrieved');
            this.itemsInQueue = items as Queue_Item[];
          },
          error: (err) => {
            console.log('Error retrieving items from queue: ' + JSON.stringify(err));
          }
        });
      },
      error: (err) => {
        console.log('Error retrieving tables from DB: ' + JSON.stringify(err));
      }
    });
  }

  getItemsRelatedToTable(tableNum: number): Queue_Item[] {
    return this.itemsInQueue.filter((item) => {
      return item.table == tableNum;
    });
  }

  //methods to the waitress related
  updateItemStatus(itemId: string, newStatus: string) {
    console.log('Request for updating, item: ' + itemId + ', new status: ' + newStatus);
    this.queueService.updateItemStatus(itemId, newStatus).subscribe({
      next: (itemUpdated) => {
        console.log('Item status updated, received: ' + JSON.stringify(itemUpdated));
      },
      error: (err) => {
        console.log('Error updating status : ' + JSON.stringify(err));
      }
    });
  }
}
