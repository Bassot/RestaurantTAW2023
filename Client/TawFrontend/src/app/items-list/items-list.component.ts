import {Component, OnInit} from '@angular/core';
import {UserService} from "../User/user.service";
import {Router} from "@angular/router";
import {ItemService} from "../Item/item.service";
import {Item} from "../Item/item";

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  items: Item[] = [];
  showOptions: boolean = false;

  constructor(private userService: UserService, private router: Router, private itemService: ItemService) {
  }

  ngOnInit(): void {
    if (this.userService.getRole() != 'Cashier')
      this.router.navigate(['/']);
    this.fetchItems();
  }

  fetchItems(): void {
    this.itemService.getItems().subscribe({
      next: (items) => {
        console.log('Items retreived');
        this.items = items;
      },
      error: (err) => console.log('Error retreiving items: ' + JSON.stringify(err))
    });
  }

  deleteItem(name: string) {
    if(confirm('Do you really want to delete '+name+' ?')) {
      this.itemService.deleteItem(name).subscribe({
        next: (item) => {
          console.log('Item deleted');
          this.fetchItems();
        },
        error: (err) => console.log('Error retreiving items: ' + JSON.stringify(err))
      });
    }
  }
  createItem(name: string, type: string, price: string){
    if(name == '' || price == '' || type == ''){
      alert('Params are not correct');
      return;
    }
    let p = parseFloat(price);
    this.itemService.createItem(name, type, p).subscribe({
      next: (item) => {
        console.log('Item created');
        this.fetchItems();
        this.showOptions = false;
      },
      error: (err) => console.log('Error uploading item: ' + JSON.stringify(err))
    });
  }
}
