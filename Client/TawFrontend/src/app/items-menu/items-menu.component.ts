import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../Item/item';
import {ItemService} from "../Item/item.service";
import {Queue_Item} from "../Queue/queue_item";
import {ActivatedRoute, Router} from "@angular/router";
import {QueueService} from "../Queue/queue.service";
import {ObjectId} from "bson";
import {UserService} from "../User/user.service";
@Component({
  selector: 'app-items-menu',
  template: `
    <div class="container" style="width: 900px; margin-top: 20px;">

      <h2 class="text-center m-5">Menù</h2>

      <table class="table table-striped table-bordered">
        <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
        </thead>

        <tbody>

        <tr *ngFor="let item of items; index as i">

          <td>{{item.name}}</td>
          <td>{{item.type}}</td>
          <td>{{item.price}}</td>
          <td>
            <button type="button" class="btn btn-info" (click)="decreaseQuantity(item.name, i)"><span
              class="bi bi-dash"></span></button>&nbsp;
            <button class="btn btn-light">{{this.quantities[i]}}
            </button>&nbsp;
            <button type="button" class="btn btn-info" (click)="increaseQuantity(item.name,item.type, item.price, i)">
              <span class="bi bi-plus"></span></button>
          </td>
        </tr>
        <br>
        <div class="container">
          <div class="row">
            <div class="row text-center">
              <button class="btn btn-primary" (click)="completeOrder()">Complete Order</button>
            </div>
          </div>
        </div>


        </tbody>
      </table>
    </div>
  `
})
export class ItemsMenuComponent implements OnInit {
  items: Item[] = [];

  queue_items: any = [];

  quantities: number[] = [];
  table_number :any;
  constructor(private itemService: ItemService,
              private route: ActivatedRoute,
              private queueService: QueueService,
              private router: Router,
              private userService: UserService) {}

  ngOnInit(): void {
    if(this.userService.getRole() != 'Waiter')
      this.router.navigate(['/']);
    this.fetchItems();
    this.route.paramMap.subscribe(params => {
      this.table_number = params.get('number');
    });
  }

  private initializeQuantities(){
    this.items.forEach((item)=>{
        this.quantities.push(0);
    });
  }
  fetchItems(): void {
    this.itemService.getItems().subscribe({
      next:(items)=>{
        console.log('Items retreived');
        this.items = items;
        this.initializeQuantities();
      },
      error: (err) => console.log('Error retreiving items: '+ JSON.stringify(err))
    });
  }

  increaseQuantity(name: string, type: string, price:number, i: number): void {
    this.quantities[i]=this.quantities[i]+1;
      const item = {
        name: name,
        type: type,
        price: price,
        timestamp: undefined, // will be populated on server side
        status: 'Pending',
        table: this.table_number,
      };
      this.queue_items.push(item);
      console.log('Item added: ' + JSON.stringify(item));
    }
  decreaseQuantity(name: string, i: number): void {
    if(this.quantities[i]>0){
      this.quantities[i]=this.quantities[i]-1;
      let j=0;
      while(this.queue_items[j].name!=name){
        j++;
      }
      this.queue_items.splice(j,1);
    }
  }



  completeOrder(): void{
    if(this.queue_items.empty){
      this.router.navigate(['/waiters']);
      return;
    }
    this.queueService.insertOrder(this.queue_items).subscribe({
      next: (res) => {
        console.log('Order inserted: ' + JSON.stringify(res));
        this.queue_items = [];
        this.router.navigate(['/waiters']);
      },
      error: (err) => {
        console.log('Error inserting order: ' + JSON.stringify(err));
      }
    });
  }
}
