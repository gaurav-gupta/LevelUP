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
    publisherModel: any = {};
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
        console.log('form>.............', form);
        this._publisherService.createPublisher(form).subscribe(res => {
             this.data.push(res);
             location.reload();
        }, (err) => {
            console.log('error....', err);
        });
    }

}
