import {Component, OnInit} from '@angular/core';
import {TableService} from "../Table/table.service";
import {Table} from "../Table/table";
import {SocketioService} from "../Socketio/socketio.service";
import {is} from "date-fns/locale";

@Component({
  selector: 'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls: ['./tables-list.component.css']
})
export class TablesListComponent implements OnInit {
  tables: Table[] = [];

  constructor(private tableService: TableService, private socketIo: SocketioService) {
  }

  ngOnInit(): void {
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

  deleteTable(tableNum: number, isFree: boolean) {
    if(!isFree){
      alert("You can't delete a table occupied!");
      return;
    }
    this.tableService.deleteTable(tableNum).subscribe({
      next:(res)=> console.log('Table '+ tableNum + 'deleted'),
      error:(err) => console.log('Error deleting table')
    });
  }
  createTable(tableNum: number, seats: number){

  }

}
