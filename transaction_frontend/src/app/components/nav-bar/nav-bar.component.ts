import { Component, OnInit, Input} from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeHeaderService } from '../../services/change-header.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {
    @Input()
    current_user: any;
    user_data: any;
    is_admin: any;

    constructor(private _storageService: StorageService, private router: Router, private changeHeaderService: ChangeHeaderService ) { 
        this.changeHeaderService.getUser().subscribe(user => {
            this.user_data = user.currentUser;
            this.is_admin = ((this.user_data)&&(this.user_data.roles == 'admin')) ?  true : false;
        });    
    }

    ngOnInit() {
        this.user_data = this.current_user;
        this.is_admin = ((this.user_data)&&(this.user_data.roles == 'admin')) ?  true : false;
    }

    // logout
    logout() {
        this._storageService.removeItem('current_user');
        this.changeHeaderService.changeHeader('');
        this.router.navigate(['/']);
    }
}