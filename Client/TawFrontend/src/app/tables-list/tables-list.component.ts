import {Component, OnInit} from '@angular/core';
import {TableService} from "../Table/table.service";
import {Table} from "../Table/table";
import {SocketioService} from "../Socketio/socketio.service";
import {is} from "date-fns/locale";
import {UserService} from "../User/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.css']
})
export class TablesListComponent implements OnInit {
  tables: Table[] = [];
  showOptions: boolean = false;

  newTableNum :any;

  constructor(private tableService: TableService,
              private socketIo: SocketioService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    if(this.userService.getRole() != 'Waiter')
      this.router.navigate(['/']);
    this.getTables();
    this.socketIo.connectTables().subscribe((m)=>{
      this.getTables();
    });
  }

  getTables() {
    this.tableService.getTables().subscribe({
      next: (tables) => {
        console.log('Tables Retreived');
        this.tables = tables;
      },
      error: (err) => console.log('Error retreiving tables : ' + JSON.stringify(err))
    })
  }

  setNewTableNum(number: number){
    this.newTableNum=number+1;
  }

  getNewTableNum(number: number){
    return this.newTableNum.toString();
  }



  deleteTable(tableNum: number, isFree: boolean) {
    if(confirm('Do you really want to delete table '+tableNum+' ?')) {
      if (!isFree) {
        alert("You can't delete a table occupied!");
        return;
      }
      this.tableService.deleteTable(tableNum).subscribe({
        next: (res) => console.log('Table ' + tableNum + 'deleted'),
        error: (err) => console.log('Error deleting table')
      });
    }
  }
  createTable(tableNum: string, seats: string){
    if(tableNum == '' || seats == ''){
      alert('Params are not correct');
      return;
    }
    let tn = parseInt(tableNum, 10);
    let s = parseInt(seats, 10);
    this.tableService.createTable(tn, s).subscribe({
      next:(res)=> {
        console.log('Table ' + tableNum + 'created');
        this.showOptions = false;
      },
      error:(err) => console.log('Error creating table')
    });
  }

}
