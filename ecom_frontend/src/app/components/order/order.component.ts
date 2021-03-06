import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';
import { CodeConstants } from '../../code_constant';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
    data: any[];
    priceDecimalValue: any;
    constructor(private router: Router, private _userService: UserService) { }
    ngOnInit() {
        this.getOrders();
    }
    getOrders() {
        this._userService.getOrders().subscribe(res => {
            if (res.length > 0) {
                this.data = res;
                this.priceDecimalValue = CodeConstants.DECIMAL;
            }
        });
    }
}
