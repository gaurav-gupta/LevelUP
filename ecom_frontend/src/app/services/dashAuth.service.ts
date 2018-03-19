import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import 'rxjs/add/operator/map';

@Injectable()
export class DashAuthService {
  private baseUrl = 'http://localhost:8080';
  constructor(private _httpClient: HttpClient, private _http: Http, private _storageService: StorageService) {
  }

  // Authentication
  loginDashUser(data) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this._http.post(this.baseUrl + '/users/login', JSON.stringify(data), options).map((res: any) => {
      return res.json();
    });
  }

  // logout dashboard user
  logoutDashUser(email) {
    return this._httpClient.post(this.baseUrl + '/users/logout/' + email, {}).map((res: any) => {
      if (res) {
        this._storageService.removeItem('current_user');
      }
    });
  }
  signUpUser(data) {
    console.log('>>>>>>>>>in service this is >>>>>>>>', data);
    return this._http.post(this.baseUrl + '/users', data).map((res: any) => {
      return res.json();
    });
  }
}
