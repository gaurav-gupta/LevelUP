import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StorageService {
    constructor() {
    }

    // set local storage
    setItem(key, value) {
        localStorage.setItem(key, value);
    }

    // get local storage
    getItem(key) {
        const data = localStorage.getItem(key);
        return data;
    }

    // remove item from local storage
    removeItem(key) {
        localStorage.removeItem(key);
    }
}
