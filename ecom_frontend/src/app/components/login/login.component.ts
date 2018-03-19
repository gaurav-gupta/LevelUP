import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashAuthService } from '../../services/dashAuth.service';
import { UserService } from '../../services/users.service';
import { StorageService } from '../../services/storage.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponentComponent implements OnInit {
  private email: string;
  private password: string;
  product: any;
  uncheck: any;
  current_user: any;
  first_name: any;
  last_name: any;
  _id: any;
  email1: any;
  password1: any;
  constructor(private route: ActivatedRoute, private router: Router, private _dashAuthService: DashAuthService,
    private _storageService: StorageService, private _userService: UserService,  private _productService: ProductService)  { }
    ngOnInit() {
      this.current_user = JSON.parse(localStorage.getItem('current_user'));
      if (this.current_user) {
        this.uncheck = true;
      }
      this.getProducts();
    }
    // Authenticate user
    private login(email1, password1) {
      this.email1 = email1.value;
      this.password1 = password1.value;
      const data = {
        email: this.email1,
        password: this.password1
      };
      console.log('>>>>>>>>>>>login data', data);
      this._dashAuthService.loginDashUser(data).subscribe(res => {
        console.log('>>>>>>>>>>>login data', res);
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
      },
      (err) => {
        console.log('error....', err);
      }
    );
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
  // sign up
  signUp(first_name, last_name, email, password) {
    this.email = email.value;
    this.password = password.value;
    this.first_name = first_name.value;
    this.last_name = last_name.value;
    const  data = {
      first_name : this.first_name ,
      last_name : this.last_name,
      email : this.email,
      password : this.password
    };
    console.log('>>>>>>>>>>>>sign up ????????', data);
    this._dashAuthService.signUpUser(data).subscribe(res => {
      location.reload();
    });
  }
}
