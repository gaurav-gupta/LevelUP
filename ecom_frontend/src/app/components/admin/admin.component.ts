import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  data: any[];
  filterQuery: any = '';
  constructor(private router: Router, private _userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this._userService.getUsers().subscribe(res => {
      this.data = res;
    }, (err) => {
      console.log('error....', err);
    });
  }
}