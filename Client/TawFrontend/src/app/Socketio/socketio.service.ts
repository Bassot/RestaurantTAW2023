import {Injectable} from '@angular/core';
import {UserService} from "../User/user.service";
import {Observable} from "rxjs";
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket: any;

  constructor(private userService: UserService) {
    this.socket = io(this.userService.getUrl())
  }

  connectQueue(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('queue', (m: any) => {
        console.log('QUEUE TOPIC: message received');
        observer.next(m);
      });
      this.socket.on('error', (err: any) => {
        console.log('Socket.io error: ' + err);
        observer.error(err);
      });
      return {
        unsubscribe: () => {
          this.socket.disconnect();
        }
      };
    });
  }
  connectTables(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('tables', (m: any) => {
        console.log('TABLES TOPIC: message received');
        observer.next(m);
      });
      this.socket.on('error', (err: any) => {
        console.log('Socket.io error: ' + err);
        observer.error(err);
      });
      return {
        unsubscribe: () => {
          this.socket.disconnect();
        }
      };
    });
  }

  connectNotifications(emailWaiter: string){
    return new Observable<any>((observer) => {
      this.socket.on(emailWaiter, (m: any) => {
        console.log(emailWaiter+' TOPIC: message received');
        observer.next(m);
      });
      this.socket.on('error', (err: any) => {
        console.log('Socket.io error: ' + err);
        observer.error(err);
      });
      return {
        unsubscribe: () => {
          this.socket.disconnect();
        }
      };
    });
  }

  getSocket(){
    return this.socket;
  }
}
