import { Component, OnInit } from '@angular/core';
import { DashAuthService } from '../../services/dashAuth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';
import { CodeConstants } from '../../code_constant';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {
    current_user: any;
    check = false;
    uncheck = false;
    wallet_amount: any;
    admin: any = false;
    price: any;
    priceDecimalValue: any;
    wallet_address: any;
    constructor(private router: Router, private _dashAuthService: DashAuthService,
        private _storageService: StorageService, private _userService: UserService) { }

        ngOnInit() {
            this.current_user = JSON.parse(localStorage.getItem('current_user'));
            if  (this.current_user) {
                this.uncheck = true;
                 this._userService.getUserByEmail(this.current_user.email).subscribe(res1 => {
                    this.price = res1[0].wallet_amount;
                    this.priceDecimalValue = CodeConstants.DECIMAL;
                    if (res1[0].roles === 'admin') {
                        this.admin = true;
                    } else {
                        this.wallet_address = res1[0].wallet_address;
                    }
                });
            }
        }

        // User logout
        logout() {
            localStorage.removeItem('current_user');
            location.reload();
            this.router.navigate(['']);
        }
    }
