import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {Table} from './table';
import {UserService} from "../User/user.service";

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private url = 'http://localhost:8080/tables';

  private headers: HttpHeaders;
  constructor(private httpClient: HttpClient, private userService: UserService) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getToken(),
      'cache-control': 'no-cache',
      'Content-Type': 'application/json'
    });
  }

  getTables(): Observable<Table[]>{
    return this.httpClient.get<Table[]>(`${this.url}`, { headers: this.headers});
  }
  createTable(number: number, seats: number){
    const newTable = {
      number: number,
      seats: seats,
      isFree: true,
      bill: 0
    }
    return this.httpClient.post(this.url, newTable, { headers: this.headers});
  }
  deleteTable(number: number){
    return this.httpClient.delete(this.url+'/'+number,{ headers: this.headers});
  }
  occupyTable(number: any, email: string){
    const params = new HttpParams().set('email', email);
    return this.httpClient.put(`${this.url}/occupy/${number}`,{email:email}, {
      headers: this.headers,
      params: params,
      responseType: 'text'
    });
  }
  freeTable(number: any){
    return this.httpClient.put(`${this.url}/free/${number}`, null, {
      headers: this.headers,
      responseType: 'text',
    });
  }
}
