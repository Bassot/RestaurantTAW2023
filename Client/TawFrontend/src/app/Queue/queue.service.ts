import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Queue_Item} from "./queue_item";
import {Observable, tap} from "rxjs";
import {UserService} from "../User/user.service";

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private url = 'http://localhost:8080/queue';
  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient, private userService: UserService) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getToken(),
      'cache-control': 'no-cache',
      'Content-Type': 'application/json'
    });
  }

  // insert an array of queue_items
  insertOrder(items: Queue_Item[]) {
    return this.httpClient.post(this.url, items, {
      headers: this.headers,
      responseType: "json"
    });
  }

  deleteTableOrder(tableId: number) {
    return this.httpClient.delete(this.url + '/table/' + tableId, {
      headers: this.headers
    });
  }

  getAllQueue() {
    return this.httpClient.get(this.url + '/all', {
      headers: this.headers
    });
  }

  getAllDishes() {
    return this.httpClient.get(this.url + '/dish', {
      headers: this.headers
    });
  }

  getAllDrinks() {
    return this.httpClient.get(this.url + '/drink', {
      headers: this.headers
    });
  }

  getTableItems(tableId: number) {
    return this.httpClient.get(this.url + '/table/' + tableId, {
      headers: this.headers
    });
  }

  updateItemStatus(itemId: string, newStatus: string) {
    return this.httpClient.put(this.url + '/', {
        id: itemId,
        status: newStatus
      }, {
        headers: this.headers
      });
  }
}
