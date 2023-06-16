import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {Table} from './table';
import {UserService} from "../User/user.service";

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private url = 'http://localhost:8080';

  private headers: HttpHeaders;
  constructor(private httpClient: HttpClient, private userService: UserService) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getToken(),
      'cache-control': 'no-cache',
      'Content-Type': 'application/json'
    });
  }

  getTables(waiter?: string): Observable<Table[]>{
    if(waiter!=undefined){
      return this.httpClient.get<Table[]>(`${this.url}/tables`, { headers: this.headers, params: new HttpParams().set('email', waiter)});
    }
    return this.httpClient.get<Table[]>(`${this.url}/tables`, { headers: this.headers});
  }
  createTable(number: number, seats: number){
    const params = {
      number: number,
      seats: seats
    }
    return this.httpClient.post(this.url, params, { headers: this.headers});
  }
  deleteTable(number: number){
    return this.httpClient.delete(this.url+'/'+number,{ headers: this.headers});
  }
  occupyTable(number: any, email: string){
    const params = new HttpParams().set('action', "occupy").set('email', email);
    return this.httpClient.put(`${this.url}/tables/${number}`, null, {
      headers: this.headers,
      params: params,
      responseType: 'text'
    });
  }
  freeTable(number: any, email: string){
    const params = new HttpParams().set('action', "free").set('email', email);
    return this.httpClient.put(`${this.url}/tables/${number}`, null, {
      headers: this.headers,
      params: params,
      responseType: 'text',
    });
  }
}
