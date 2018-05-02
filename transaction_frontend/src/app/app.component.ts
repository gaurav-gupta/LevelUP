import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashAuthService } from './services/dashAuth.service';
import { StorageService } from './services/storage.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    current_user: any;
    constructor(private route: ActivatedRoute, private router: Router, private _dashAuthService: DashAuthService,
        private _storageService: StorageService, private _flashMessagesService: FlashMessagesService)  { }

        ngOnInit() {
            this.current_user = JSON.parse(localStorage.getItem('current_user'));
        }
}
