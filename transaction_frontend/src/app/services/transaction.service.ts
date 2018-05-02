import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from './../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class TransactionService {
    private baseUrl = environment.baseUrl;
    formData: any;
    xhr: any;
    constructor(private _httpClient: HttpClient, private _http: Http, private _storageService: StorageService) {
    }

    getTransactions() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this._http.get(this.baseUrl + '/transactions').map((res: any) => {
            return res.json();
        });
    }

    getUserTransactions() {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });
        return this._httpClient.get(this.baseUrl + '/transactions/my').map((res: any) => {
            console.log("res >>>>>>>>>>>>>>>>>>>>>>")
            console.log(res)
            return res;
        });
    }

    // getOneProduct(_id) {
    //     const headers = new Headers({ 'Content-Type': 'application/json' });
    //     const options = new RequestOptions({ headers: headers });
    //     return this._http.get(this.baseUrl + '/products/' + _id).map((res: any) => {
    //         return res.json();
    //     });
    // }

    // getCategories() {
    //     const _path: string = (this.baseUrl + '/products/category');
    //     return this._httpClient.get(_path).map((res: any) => {
    //         return res;
    //     });
    // }

    // createProduct(productData) {
    //     const _path: string = (this.baseUrl + '/products');
    //     return this._httpClient.post(_path, productData).map((res: any) => {
    //         return res;
    //     });
    // }
}
