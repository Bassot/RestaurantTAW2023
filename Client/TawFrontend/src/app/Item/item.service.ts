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
  deleteItem(){
    return this.httpClient.delete(`${this.url}`, { headers: this.headers});
  }
  createItem(){
    return this.httpClient.post(`${this.url}`, { headers: this.headers});
  }

}
