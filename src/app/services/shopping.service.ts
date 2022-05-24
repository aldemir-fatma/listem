import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

export interface ShoppingList {
  id:number;
  user_id: number;
  name: string;
  created_at: string;

}

 
@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  constructor(private http: HttpClient,
    private authService: AuthenticationService) {}
 
  //alışveriş listelerini getirmek için
  getShoppingLists(): Observable<ShoppingList[]> {
    let params = new HttpParams().set('token', this.authService.token);
    params = params.set('username', this.authService.username);

    return this.http.get<ShoppingList[]>(
      `${environment.baseUrl}/listeler`, {params: params}
    );
  }
 
  //alışveriş listelesi içindeki ürünleri getirmek için
  getShoppingListItems(id: string): Observable<any[]> {
    let params = new HttpParams().set('token', this.authService.token);
    params = params.set('username', this.authService.username);

    return this.http.get<any[]>(
      `${environment.baseUrl}/urunler/${id}`, {params: params}
    );
  }

  //alışveriş listelesi içindeki ürünleri alındı olarak işaretlemek için
  setShoppingListItem(id: string, status: any): Observable<any[]> {
    let params = new HttpParams().set('token', this.authService.token);
    params = params.set('username', this.authService.username);
    params = params.set('status', status);
    return this.http.post<any[]>(
      `${environment.baseUrl}/urun-isaretle/${id}`, params
    );
  }

  addShoppingList(name: string): Observable<any[]> {
    let params = new HttpParams().set('token', this.authService.token);
    params = params.set('username', this.authService.username);
    params = params.set('name', name);
    return this.http.post<any[]>(
      `${environment.baseUrl}/liste-ekle`, params
    );
  }

  addShoppingListItem(name: string, listId: string): Observable<any[]> {
    let params = new HttpParams().set('token', this.authService.token);
    params = params.set('username', this.authService.username);
    params = params.set('name', name);
    params = params.set('list_id', listId);
    return this.http.post<any[]>(
      `${environment.baseUrl}/urun-ekle`, params
    );
  }

  deleteShoppingListItem(id: string): Observable<any[]> {
    let params = new HttpParams().set('token', this.authService.token);
    params = params.set('username', this.authService.username);
    
    return this.http.post<any[]>(
      `${environment.baseUrl}/urun-sil/${id}`, params
    );
  }

  deleteShoppingList(id: string): Observable<any[]> {
    let params = new HttpParams().set('token', this.authService.token);
    params = params.set('username', this.authService.username);
    return this.http.post<any[]>(
      `${environment.baseUrl}/liste-sil/${id}`, params
    );
  }
}