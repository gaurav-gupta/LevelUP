import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { CodeConstants } from '../../code_constant';

@Component({
    selector: 'app-user-transaction',
    templateUrl: './user-transaction.component.html',
    styleUrls: ['./user-transaction.component.css']
})
export class UserTransactionComponent implements OnInit {
    data: any[];
    userdata: any;
    priceDecimalValue: any;
    constructor(private router: Router, private _userService: UserService, private _flashMessagesService: FlashMessagesService) { }

    ngOnInit() {
        this.getUserTransaction();
    }

    getUserTransaction() {
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        this._userService.getUserByEmail(currentUser.email).subscribe(res1 => {
         this.userdata = res1[0];
        this._userService.getUserTransaction(this.userdata._id).subscribe(response => {
            if (response.length > 0) {
                this.data = response;
                this.priceDecimalValue = CodeConstants.DECIMAL;
            } else {
             this._flashMessagesService.show('No Transaction Placed Yet !!', { cssClass: 'alert-success', timeout: 7000 });
            }
        });
    });
    }


}
