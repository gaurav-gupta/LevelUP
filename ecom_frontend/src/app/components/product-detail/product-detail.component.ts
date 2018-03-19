import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/users.service';
import { DashAuthService } from '../../services/dashAuth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  _id: any;
  product: any;
  state: any = 'Select State';
  data: any;
  current_user: any;
  check: any;
  statebuy: any  = false;
  statte: any = false;
  email: any;
  password: any;
  loader: any = false;

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
      }, (err) => {
        console.log('error....', err);
      });
    }

    createOrder(form) {
      this.loader = true;
      this.data = {
        'address': {
          'address': form.address,
          'pincode': form.pincode,
          'state': form.state,
          'phone_number': form.phone_number,
          'city': form.city
        },
        'customer_email': this.check.email,
        'customer_id': this.check._id,
        'price': this.product.price,
        'productId': this.product.productId
      };
      this._userService.createOrder(this.data).subscribe((res: any) => {
        if (Object.keys(res).length > 0) {
          this.loader = false;
          alert('Order Placed Successfully !!');
          location.reload();
          this.router.navigate(['product']);
        }
      },
      (err) => {
        console.log('error>>>>>>>>>>>>', err);
      });
    }

    login(email, password ) {
      this.email = email.value;
      this.password = password.value;
      const data = {
        email: this.email,
        password: this.password
      };
      this._dashAuthService.loginDashUser(data).subscribe(res => {
        if (res) {
          this._storageService.setItem('current_user', JSON.stringify(res));
          const currentUser = JSON.parse(localStorage.getItem('current_user'));
          this._userService.getUserByEmail(currentUser.email).subscribe(res1 => {
            if (res1[0].roles === 'admin') {
              location.reload();
              this.router.navigate(['/admin']);
            } else {
              location.reload();
              this.router.navigate(['/product']);
            }
          });
        }
      }, (err) => {
        console.log('error....', err);
      });
    }
  }
