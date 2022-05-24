import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'my-token';
const USERNAME_KEY = 'my-username';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  username = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  login(credentials: {email, password}): Observable<any> {
    return this.http.post(`${environment.baseUrl}/giris`, credentials).pipe(
      map((data: any) => data),
      switchMap(user => {
        Storage.set({key: USERNAME_KEY, value: user.username});
        return from(Storage.set({key: TOKEN_KEY, value: user.token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  signup(credentials: {email, password}): Observable<any> {
    return this.http.post(`${environment.baseUrl}/kayit`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({key: TOKEN_KEY});
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    const username = await Storage.get({ key: USERNAME_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }

    if (username && username.value) {
      console.log('set username: ', username.value);
      this.username = username.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
}
