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
  user: any = false ;
  admin: any = false;
  price: any;
  priceDecimalValue: any;
  constructor(private router: Router, private _dashAuthService: DashAuthService,
    private _storageService: StorageService, private _userService: UserService) { }

    ngOnInit() {
      this.current_user = JSON.parse(localStorage.getItem('current_user'));
      if  (this.current_user) {
        this._userService.getUserByEmail(this.current_user.email).subscribe(res1 => {
          this.price = res1[0].wallet_amount;
          this.priceDecimalValue = CodeConstants.DECIMAL;
          if (res1[0].roles === 'admin') {
            this.admin = true;
          } else {
            this.user = true;
          }
        });
      }
      if (this.current_user) {
        this.uncheck = true;
      }
    }

    // User logout
    logout() {
      localStorage.removeItem('current_user');
      this.router.navigate(['/']);
      location.reload();
    }
  }
