import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()

export class PublisherService {
    private baseUrl = environment.baseUrl;
    constructor(private _httpClient: HttpClient, private _http: Http) {

    }

    // get publisher

    getPublisher() {
        return this._httpClient.get(this.baseUrl + '/users/publisher').map((res: any) => {
            return res;
        });
    }


    createPublisher(form) {
        const body: any = JSON.stringify(form);
        const _path: string = (this.baseUrl + '/users/publisher');
        return this._httpClient.post(_path, body).map((res: any) => {
            return res;
        });
    }
}
