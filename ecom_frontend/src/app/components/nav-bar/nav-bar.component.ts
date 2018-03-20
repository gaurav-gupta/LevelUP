import { Component, OnInit } from '@angular/core';
import { DashAuthService } from '../../services/dashAuth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';

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
  constructor(private router: Router, private _dashAuthService: DashAuthService,
    private _storageService: StorageService, private _userService: UserService) { }

    ngOnInit() {
      this.current_user = JSON.parse(localStorage.getItem('current_user'));
      this._userService.getUserByEmail(this.current_user.email).subscribe(res1 => {
        console.log('>>>>>>>>>>>>>res1', res1[0].wallet_amount);
        this.wallet_amount = res1[0].wallet_amount;
        if (res1[0].roles === 'admin') {
          this.check = true;
        }
        if (res1) {
          this.uncheck = true;
        }
      });
    }

    // dashboardUser logout
    private logout() {
      this._dashAuthService.logoutDashUser(this.current_user.email).subscribe(res => {
        this.router.navigate(['']);
      });
    }

  }
