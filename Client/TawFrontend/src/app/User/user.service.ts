import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject, tap} from 'rxjs';
import {User} from './user';
import {Auth} from "../Auth/auth";
import jwt_decode from 'jwt-decode';

interface Token{
  email: string,
  username: string,
  role: string,
  id: string,
  exp: any
}
interface ReceivedToken {
  token: string;
}
let tokenForExport: string = '';
export function getToken(){
  return tokenForExport;
}
@Injectable()
export class UserService {
  private url = 'http://localhost:8080';
  private token: string = '';
  private headers: HttpHeaders = new HttpHeaders();
  private users$: Subject<User[]> = new Subject();

  constructor(private http: HttpClient) {
    const loadedToken = localStorage.getItem('auth_jwt');
    if (!loadedToken || loadedToken.length < 1) {
      console.log("No token found in local storage");
    }
    else {
      this.token = loadedToken as string;
      tokenForExport = this.token;
      console.log("JWT loaded from local storage.")
    }
    this.refreshHeaders();
  }

  // in this class we must define this method. Token is generated after login
  private refreshHeaders(){
    this.headers = new HttpHeaders({
      'Authorization' : 'Bearer ' + this.token,
      'cache-control': 'no-cache',
      'Content-Type':  'application/json'
    });
  }

  signIn(curUser: Auth, remember: boolean) {
    console.log('New login request from ' + curUser.email);
    //TODO: headers
    return this.http.post(`${this.url}/login`, curUser).pipe(
      tap((res) => {
        this.token = (res as ReceivedToken).token as string;
        tokenForExport = this.token;
        console.log('Token : ' + this.token);
        this.refreshHeaders();
        if (remember) {
          localStorage.setItem('auth_jwt', this.token);
          console.log('Token saved in local storage');
        }
      }));
  }

  isLoggedIn(): boolean {
    const now = Math.floor(Date.now() / 1000)
    return this.token !== '' /* && (jwt_decode(this.token) as Token).exp < now */;
  }

  logOut() {
    this.token = '';
    localStorage.removeItem('auth_jwt');
    console.log('Logged out');
  }

  getUsers(): Observable<User[]>{
    console.log('TOKEN: '+ this.token)
    return this.http.get<User[]>(`${this.url}/users`, { headers: this.headers });
  }

  createUser(user: User) {
    return this.http.post(`${this.url}/signup`, user, {headers: this.headers});
  }
  deleteUser(email: string): Observable<any> {
    return this.http.delete(`${this.url}/users/${email}`, {headers: this.headers});
  }
  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.url}/users/${username}`);
  }
  updateUser(email: string, user: User): Observable<any> {
    return this.http.put(`${this.url}/users/${email}`, user, {headers: this.headers});
  }
  public getToken(){
    return this.token;
  }

  getEmail(){
    return (jwt_decode(this.token) as Token).email;
  }
  getRole(){
    return (jwt_decode(this.token) as Token).role;
  }
  getUrl(){
    return this.url;
  }
}
