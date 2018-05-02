import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublisherService } from '../../services/publisher.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import {ViewChild, ElementRef} from '@angular/core';
import { CodeConstants } from '../../code_constant';
@Component({
    selector: 'app-publisher',
    templateUrl: './publisher.component.html',
    styleUrls: ['./publisher.component.css']
})
export class PublisherComponent implements OnInit {
    data: any[];
    publisherModel: any = {
        'first_name': '',
        'last_name': '',
        'email': '',
        'password': '',
        'token': '',
        'website_url': ''
    };
    priceDecimalValue: any;
    publisherError: any;
    flag: any = false;
    loader: any = false;
    @ViewChild('closeBtn') closeBtn: ElementRef;
    constructor(private route: ActivatedRoute, private router: Router, private _publisherService: PublisherService,
        private _flashMessagesService: FlashMessagesService) { }

        ngOnInit() {
            this.getPublisher();
        }

        getPublisher() {
            this._publisherService.getPublisher().subscribe(res => {
                this.data = res;
                this.priceDecimalValue = CodeConstants.DECIMAL;
            }, (err) => {
                console.log('error....', err);
            });
        }

        createPublisher(form) {
            const that = this;
            const filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
            if (!filter.test(form.email)) {
                this.publisherError = 'Invalid Email Address !!';
                this.flag = true;
                setTimeout(function(){
                    that.flag = false;
                }, 3000);
            } else if (form.first_name === '' || form.last_name === '' || form.password === '' ||
            form.email === '' || form.token === '' || form.website_url === '') {
                this.publisherError = 'All these fields are required !!';
                this.flag = true;
                setTimeout(function(){
                    that.flag = false;
                }, 3000);
            } else {
                this.loader = true;
                this._publisherService.createPublisher(form).subscribe(res => {
                    if (Object.keys(res).length > 0) {
                        this.data.push(res);
                        this.loader = false;
                        this.closeBtn.nativeElement.click();
                        this._flashMessagesService.show('Publisher Created Successfully !!', { cssClass: 'alert-success',
                         timeout: 4000, showCloseBtn: true });
                        this.publisherModel = {};
                    }
                }, (err) => {
                    this.loader = false;
                    this.publisherError = err.error.replace(/"/g, '');
                    this.flag = true;
                    setTimeout(function() {
                        that.flag = false;
                    }, 3000);
                });
            }
        }
    }
