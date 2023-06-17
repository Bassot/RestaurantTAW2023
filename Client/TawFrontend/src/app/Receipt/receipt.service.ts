import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "../User/user.service";
import {Receipt} from "./receipt";
import {Observable} from "rxjs";
import {Queue_Item} from "../Queue/queue_item";

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private url = 'http://localhost:8080/receipts';
  private headers: HttpHeaders;


  constructor(private userService: UserService, private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.userService.getToken(),
      'cache-control': 'no-cache',
      'Content-Type': 'application/json'
    });
  }

  addReceipt(receipt: Receipt){
    return this.httpClient.post(this.url, receipt, { headers: this.headers });
  }

  getProfit(day1: Date, day2: Date): Observable<Receipt[]>{
    const body = {
      start: day1,
      end: day2
    };
    return this.httpClient.post<Receipt[]>(this.url+'/profit', body, { headers: this.headers });
  }

  emitReceipt(tableNum: number, items: Queue_Item[], total: number): Observable<Blob>{
    const params = {
      tableNum: tableNum,
      items: items,
      total: total,
      waiter: items[0].waiter,
      timestamp: undefined
    };
    return this.httpClient.post<Blob>(this.url + '/receiptPDF', params, {
      headers: this.headers,
      responseType: 'blob' as 'json'
    });
  }
  emitProfit(day1: Date, day2: Date, receipts: Receipt[], statistics: any): Observable<Blob>{
    const params = {
      start: day1,
      end: day2,
      receipts: receipts,
      total: statistics.total,
      itStatistics: statistics.itStatistics,
      waitStatistics: statistics.waitStatistics
    };
    return this.httpClient.post<Blob>(this.url + '/profitPDF', params, {
      headers: this.headers,
      responseType: 'blob' as 'json'
    });
  }
}
