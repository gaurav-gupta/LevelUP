import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashAuthService } from '../../services/dashAuth.service';
import { StorageService } from '../../services/storage.service';
import { ChangeHeaderService } from '../../services/change-header.service';
import { CodeConstants } from '../../code_constant';

@Component({
    selector: 'app-login-component',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponentComponent implements OnInit {
    private data;
    private userData;
    constructor(private route: ActivatedRoute, private router: Router, private _dashAuthService: DashAuthService,
        private _storageService: StorageService, private changeHeaderService: ChangeHeaderService)  { 
    }

    ngOnInit() {
    }
    
    // login
    login(email, password) {
        this.data = {
            email : email,
            password : password
        };
        this._dashAuthService.loginDashUser(this.data).subscribe(res => {
            if (res) {
                this._storageService.setItem('current_user', JSON.stringify(res));
                this.changeHeaderService.changeHeader(res);
                this.router.navigate(['/']);
            }
        });
    }
}
