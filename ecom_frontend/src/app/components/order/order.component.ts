import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  data: any[];
  constructor(private router: Router, private _userService: UserService) { }
  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this._userService.getOrders().subscribe(res => {
      this.data = res;
    });
  }

  updateOrderStatus(orderNumber, updatedOrderStatus) {
    this._userService.updateOrderStatus(orderNumber, updatedOrderStatus).subscribe(res => {
      if (Object.keys(res).length > 0) {
        alert('Order Status Update Successfully !!');
        this.getOrders();
      }
    },
    (err) => {
      console.log('error>>>>>>>>>>>>', err);
    });
  }
}