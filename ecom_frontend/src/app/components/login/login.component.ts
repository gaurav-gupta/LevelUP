import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashAuthService } from '../../services/dashAuth.service';
import { UserService } from '../../services/users.service';
import { StorageService } from '../../services/storage.service';
import { ProductService } from '../../services/product.service';
import * as ipfsAPI from 'ipfs-api';
import * as buffer from 'buffer';
const Buffer1 = buffer.Buffer;
const ipfs = ipfsAPI({host: '13.250.35.159', port: '5001', protocol: 'http'});

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponentComponent implements OnInit {
  private email: string;
  private password: string;
  error: any;
  product: any;
  uncheck: any = false;
  current_user: any;
  first_name: any;
  last_name: any;
  _id: any;
  email1: any;
  check: any;
  password1: any;
  errorState: any;
  admin: any;
  user: any;
  filedata: any;
  checkAdmin: boolean;
  constructor(private route: ActivatedRoute, private router: Router, private _dashAuthService: DashAuthService,
    private _storageService: StorageService, private _userService: UserService,  private _productService: ProductService)  { }
    ngOnInit() {
      this.getProducts();
      this.current_user = JSON.parse(localStorage.getItem('current_user'));
      console.log('this.current_user>>>>>>>>>>>.', this.current_user);
      if (this.current_user) {
        this.uncheck = true;
      }

      this._userService.getUserByEmail(this.current_user.email).subscribe(res1 => {
          if (res1[0].roles === 'admin') {
              this.checkAdmin = true;
          } else {
               this.checkAdmin = false;
          }
      });

    }

    // get one product
    getOneProduct() {
      this._productService.getOneProduct(this._id).subscribe(res => {
        this.product = res[0];
        const that = this ;
        ipfs.files.cat(this.product.descLink, function (err, file) {
          that.filedata = file;
        });
      }, (err) => {
        console.log('error....', err);
      });
    }
    // get list of products
    getProducts() {
      this._productService.getProduct().subscribe(res => {
        this.product = res;
      });
    }

    // user logout
    logout() {
      this._dashAuthService.logoutDashUser(this.current_user.email).subscribe(res => {
        location.reload();
      });
    }

  }
