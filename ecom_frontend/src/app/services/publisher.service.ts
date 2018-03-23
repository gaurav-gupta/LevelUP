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

}
