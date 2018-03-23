import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users.service';
import { StorageService } from '../../services/storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CodeConstants } from '../../code_constant';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.css']
})

export class UserOrderComponent implements OnInit {
  data: any[];
  userdata: any;
  priceDecimalValue: any;
  constructor(private route: ActivatedRoute, private router: Router, private _userService: UserService,
    private _storeService: StorageService) { }

    ngOnInit() {
      this.getUserOrder();
    }

    getUserOrder() {
      const currentUser = JSON.parse(localStorage.getItem('current_user'));
      this._userService.getUserByEmail(currentUser.email).subscribe(res1 => {
        this.userdata = res1[0];
        this._userService.getUserOrder(this.userdata._id).subscribe(response => {
          if (response.length > 0) {
            this.data = response;
            this.priceDecimalValue = CodeConstants.DECIMAL;
          } else {
            alert('No Orders Placed Yet !!');
          }
        });
      });
    }
  }
