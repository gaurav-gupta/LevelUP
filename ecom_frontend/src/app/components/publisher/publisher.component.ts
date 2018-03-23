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
    constructor(private route: ActivatedRoute, private router: Router, private _publisherService: PublisherService) { }

    ngOnInit() {

    }

}
