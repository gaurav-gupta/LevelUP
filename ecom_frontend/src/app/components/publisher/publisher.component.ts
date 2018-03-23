import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublisherService } from '../../services/publisher.service';

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
    publisherError: any;
    flag: any = false;
    loader: any = false;
    constructor(private route: ActivatedRoute, private router: Router, private _publisherService: PublisherService) { }

    ngOnInit() {
        this.getPublisher();
    }

    getPublisher() {
        this._publisherService.getPublisher().subscribe(res => {
            this.data = res;
        }, (err) => {
            console.log('error....', err);
        });
    }

    createPublisher(form) {
        const that = this;
        if (form.first_name === '' || form.last_name === '' || form.password === '' ||
            form.email === '' || form.token === '' || form.website_url === '') {
            this.publisherError = 'All these fields are required !!';
            this.flag = true;
            setTimeout(function(){
                that.flag = false;
            }, 3000);
        } else {
            this.loader = true;
            this._publisherService.createPublisher(form).subscribe(res => {
                console.log('res>>>>>>>>>>>>.', res);
                if (Object.keys(res).length > 0) {
                    this.data.push(res);
                    this.loader = false;
                    alert('Publisher Created Successfully !!');
                    location.reload();
                }
            }, (err) => {
                console.log('errooOOOOOOOOOOOOOO', err);
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
