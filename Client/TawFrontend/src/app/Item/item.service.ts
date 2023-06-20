import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {Item} from './item';
import {UserService} from "../User/user.service";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url = 'http://localhost:8080/menu';
  private headers: HttpHeaders;
  private items$: Subject<Item[]> = new Subject();


  constructor(private httpClient: HttpClient, private userService: UserService) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getToken(),
      'cache-control': 'no-cache',
      'Content-Type':  'application/json'
    })
  }
  getItems(): Observable<Item[]>{
    return this.httpClient.get<Item[]>(`${this.url}`, { headers: this.headers});
  }
  deleteItem(name: string){
    return this.httpClient.delete(`${this.url}/${name}`, { headers: this.headers});
  }
  createItem(name: string, type: string, price: number){
    const newItem = {
      name: name,
      type: type,
      price: price
    };
    return this.httpClient.post(`${this.url}`, newItem,{ headers: this.headers});
  }

}
