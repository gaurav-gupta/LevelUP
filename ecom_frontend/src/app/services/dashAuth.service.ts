import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from './../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class DashAuthService {
    private baseUrl = environment.baseUrl;
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

    signUpUser(data) {
        return this._http.post(this.baseUrl + '/users', data).map((res: any) => {
            return res.json();
        });
    }
}
