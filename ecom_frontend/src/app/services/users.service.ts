import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from './../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  private baseUrl = environment.baseUrl;
  constructor(private _httpClient: HttpClient, private _http: Http, private _storageService: StorageService) {
  }

  // Get user by Email
  getUserByEmail(email) {
    return this._httpClient.get(this.baseUrl + '/users/' + email).map((res: any) => {
      return res;
    });
  }

  // Get all user
  getUsers() {
    return this._httpClient.get(this.baseUrl + '/users').map((res: any) => {
      return res;
    });
  }
  // create user
  createOrder(data) {
    const body: any = JSON.stringify(data);
    const _path: string = (this.baseUrl + '/orders');
    return this._httpClient.post(_path, body).map((res: any) => {
      return res;
    });
  }
// get order of user
  getUserOrder(_id) {
    return this._httpClient.get(this.baseUrl + '/orders/' + _id).map((res: any) => {
      return res;
    });
  }
// get all orders
  getOrders() {
    return this._httpClient.get(this.baseUrl + '/orders').map((res: any) => {
      return res;
    });
  }
}
