import {Component, OnInit} from '@angular/core';
import {Table} from "../Table/table";
import {QueueService} from "../Queue/queue.service";
import {TableService} from "../Table/table.service";
import {SocketioService} from "../Socketio/socketio.service";
import {Queue_Item} from "../Queue/queue_item";
import {ReceiptService} from "../Receipt/receipt.service";
import {Receipt} from "../Receipt/receipt";
import {UserService} from "../User/user.service";
import {Router} from "@angular/router";
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent implements OnInit {
  itemsInQueue: Queue_Item[] = [];
  tables: Table[] = [];

  constructor(private queueService: QueueService,
              private tablesService: TableService,
              private socketService: SocketioService,
              private receiptService: ReceiptService,
              private userService: UserService,
              private router: Router) {}

  ngOnInit(): void {
    if (this.userService.getRole() != 'Cashier')
      this.router.navigate(['/']);
    // refreshTables is calling also the refreshQueue method
    this.refreshTables();
    // cashier is connected in both queue and table topic to see the updates
    this.socketService.connectQueue().subscribe((m) => {
      this.refreshQueue();
    });
    this.socketService.connectTables().subscribe((m) => {
      this.refreshTables();
    });
  }

  //  getting data from DB
  refreshTables() {
    this.tablesService.getTables().subscribe({
      next: (tables) => {
        console.log('Tables retrieved');
        this.tables = tables as Table[];

        // refreshing also the queue
        this.refreshQueue();
      },
      error: (err) => {
        console.log('Error retrieving tables from DB: ' + JSON.stringify(err));
      }
    });
  }
  private refreshQueue() {
    this.queueService.getAllQueue().subscribe({
      next: (items) => {
        console.log('Items in queue retrieved');
        this.itemsInQueue = items as Queue_Item[];

        // calculating the totals
        this.calculateTableTotalPrice();
      },
      error: (err) => {
        console.log('Error retrieving items from queue: ' + JSON.stringify(err));
      }
    });
  }

  // methods to manage the data on this client
  private getItemsRelatedToTable(tableNum: number): Queue_Item[] {
    return this.itemsInQueue.filter((item) => {
      return item.table == tableNum;
    });
  }

  private calculateTableTotalPrice() {
    this.tables.forEach((table) => {
      table.bill = 0.0;
      this.getItemsRelatedToTable(table.number).forEach((item) => {
        table.bill += item.price;
      })
    });
  }

  private getStatisticsByReceipts(receipts: Receipt[]) {
    let itStat: any[] = [];
    let waitStat: any[] = [];
    let s = 0.0;
    receipts.forEach((rec)=>{
      rec.items.forEach((item)=>{

        let i = itStat.findIndex((it) => it.name == item.name);
        if(i < 0){
          itStat.push({name: item.name, num: 1});
        } else{
          (itStat[i].num)++;
        }

        let w = waitStat.findIndex((it) => it.email == item.waiter)
        if(w < 0){
          waitStat.push({email: item.waiter, num: 1});
        } else{
          (waitStat[w].num)++;
        }
      });
      s += rec.total;
    });
    itStat.sort((a, b) => b.num - a.num);
    waitStat.sort((a, b) => b.num - a.num);
    return {
      itStatistics: itStat,
      waitStatistics: waitStat,
      total: s
    };
  }

  // single receipt methods
  emitReceipt(tableNum: number, tableBill: number) {
    this.makeReceiptPdf(tableNum, this.getItemsRelatedToTable(tableNum), tableBill);
  }

  makeReceiptPdf(tableNum: number, items: Queue_Item[], tableBill: number) {
    this.receiptService.emitReceipt(tableNum, items, tableBill).subscribe({
      next: (data) => {
        let file = new Blob([data], {type: 'application/pdf'})
        let fileURL = URL.createObjectURL(file);
        // if you want to open PDF in new tab
        window.open(fileURL);
      },
      error: (err) => {
        console.log('Error retrieving receipt PDF from server: ' + JSON.stringify(err));
      }
    });
  }

  private uploadReceipt(tableNum: number, tableBill: number, waiter: string) {
    let receipt: any = {
      table: tableNum,
      items: this.getItemsRelatedToTable(tableNum),
      total: tableBill,
      waiter: waiter,
      timestamp: undefined
    }
    this.receiptService.addReceipt(receipt).subscribe({
      next: (res) => {
        console.log('Receipt uploaded: ' + JSON.stringify(res));
      },
      error: (err) => {
        console.log('Error uploading receipt: ' + JSON.stringify(err));
      }
    })
  }

  // methods to calculate profit
  private makeProfitPdf(day1: Date, day2: Date, receipts: Receipt[], statistics: any) {
    this.receiptService.emitProfit(day1, day2, receipts, statistics).subscribe({
      next: (data) => {
        let file = new Blob([data], {type: 'application/pdf'})
        let fileURL = URL.createObjectURL(file);
        // if you want to open PDF in new tab
        window.open(fileURL);
      },
      error: (err) => {
        console.log('Error retrieving profit PDF from server: ' + JSON.stringify(err));
      }
    });
  }
  emitDailyProfit() {
    let today = new Date();
    let day1 = startOfDay(today);
    let day2 = endOfDay(today);
    this.receiptService.getProfit(day1, day2).subscribe({
      next: (receipts) => {
        console.log('Receipts retrieved from DB');
        this.makeProfitPdf(day1, day2, receipts, this.getStatisticsByReceipts(receipts));
      },
      error: (err) => {
        console.log('Error retrieving receipts from DB: ' + JSON.stringify(err));
      }
    })
  }
  emitWeeklyProfit() {
    function getMonday(d: Date) {
      d = new Date(d);
      let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }

    let today = new Date();
    let day1 = startOfDay(getMonday(today));
    let day2 = endOfDay(today);
    this.receiptService.getProfit(day1, day2).subscribe({
      next: (receipts) => {
        console.log('Receipts retrieved from DB');
        this.makeProfitPdf(day1, day2, receipts, this.getStatisticsByReceipts(receipts));
      },
      error: (err) => {
        console.log('Error retrieving receipts from DB: ' + JSON.stringify(err));
      }
    })
  }
  emitMonthlyProfit() {
    let today = new Date();
    let firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let day1 = endOfDay(firstDayOfThisMonth);
    let day2 = endOfDay(today);
    this.receiptService.getProfit(day1, day2).subscribe({
      next: (receipts) => {
        console.log('Receipts retrieved from DB');
        this.makeProfitPdf(day1, day2, receipts, this.getStatisticsByReceipts(receipts));
      },
      error: (err) => {
        console.log('Error retrieving receipts from DB: ' + JSON.stringify(err));
      }
    })
  }

  // methods to free tables and their related items
  private isEveryTableItemReady(tableNum: number): boolean {
    return this.getItemsRelatedToTable(tableNum).every((item) => {
      return item.status == 'Ready';
    });
  }

  freeTableAndItems(tableNum: number, tableBill: number, waiter: string) {
    if (confirm("Are you sure to free table " + tableNum + ", its related items and to store the receipt?")) {
      if (!this.isEveryTableItemReady(tableNum)) {
        alert('There are still some items not ready in the table ' + tableNum + ", you can' t free the table. Ping the cooks or the bartenders");
        return;
      }

      // first we upload the receipt to DB
      this.uploadReceipt(tableNum, tableBill, waiter);

      // deleting items from queue
      this.queueService.deleteTableOrder(tableNum).subscribe({
        next: (res) => {
          console.log('Items related to table ' + tableNum + ' deleted');

          //free the table
          this.tablesService.freeTable(tableNum).subscribe({
            next: (res) => console.log('Table ' + tableNum + ' now is free'),
            error: (err) => console.log('Error setting the table ' + tableNum + ' to free ')
          });

        },
        error: (err) => console.log('Error deleting the item related to table ' + tableNum)
      });
    }
  }

  // routing
  navToUsersList(){
    this.router.navigate(['/userslist']);
  }
  navToItemsList(){
    this.router.navigate(['/itemslist']);
  }
  navToTablesList(){
    this.router.navigate(['/tableslist']);
  }
}
