import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/users.service';
import { DashAuthService } from '../../services/dashAuth.service';
import { StorageService } from '../../services/storage.service';
import * as ipfsAPI from 'ipfs-api';
import * as buffer from 'buffer';
const Buffer1 = buffer.Buffer;
const ipfs = ipfsAPI({host: '13.250.35.159', port: '5001', protocol: 'http'});

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  _id: any;
  product: any;
  state: any;
  data: any;
  current_user: any;
  check: any;
  statebuy: any  = false;
  statte: any = false;
  email: any;
  password: any;
  loader: any = false;
  filedata: any;

  constructor(private route: ActivatedRoute, private router: Router, private _productService: ProductService,
    private _userService: UserService , private _dashAuthService: DashAuthService, private _storageService: StorageService) { }

    ngOnInit() {
      this.current_user = JSON.parse(localStorage.getItem('current_user'));
      this.route.params.subscribe((params: any) => {
        this._id = params._id;
        this.getOneProduct();
      });
      this._userService.getUserByEmail(this.current_user.email).subscribe(response => {
        this.check =  response[0];
      });
    }

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
  }
