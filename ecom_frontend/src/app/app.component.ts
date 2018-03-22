import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashAuthService } from './services/dashAuth.service';
import { UserService } from './services/users.service';
import { StorageService } from './services/storage.service';
import { ProductService } from './services/product.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';
    email: any;
    password: any;
    check: any= false;
    current_user: any;
    product: any;
    first_name: any;
    last_name: any;
    user: any = false;
    admin: any = false;
    loader: any = false;
    data: any;
    hideModal: any;
    loginError: any;
    singupError: any;

    constructor(private route: ActivatedRoute, private router: Router, private _dashAuthService: DashAuthService,
        private _storageService: StorageService, private _userService: UserService,  private _productService: ProductService)  { }

        ngOnInit() {
            this.getProducts();
            this.current_user = JSON.parse(localStorage.getItem('current_user'));
            if (this.current_user) {
                this.check = true;
            }
        }
        // login
        login(email1, password1) {
            this.email = email1.value;
            this.password = password1.value;
            if (this.email === '' ||  this.password === '') {
                this.loginError = 'Email/Password are required !!';
            } else {
                const data = {
                    email: this.email,
                    password: this.password
                };
                this._dashAuthService.loginDashUser(data).subscribe(res => {
                    if (!res.error) {
                        // email1 = '';
                        // password1 = '';
                        this._storageService.setItem('current_user', JSON.stringify(res));
                        const currentUser = JSON.parse(localStorage.getItem('current_user'));
                        this._userService.getUserByEmail(currentUser.email).subscribe(res1 => {
                            if (res1[0].roles === 'admin') {
                                this.admin = true;
                                location.reload();
                                this.router.navigate(['/admin']);
                            } else {
                                this.user = true;
                                location.reload();
                                this.router.navigate(['/']);
                            }
                        });
                    }
                }, (err) => {
                    console.log('erro>>>>>>>>..', err._body);
                    console.log('erro>>>>>>>', err._body['error']);
                    this.loginError = err._body;
                });
            }
        }

        // get list of products
        getProducts() {
            this._productService.getProduct().subscribe(res => {
                this.product = res;
            });
        }

        // sign up
        signUp(first_name, last_name, email, password) {
            this.email = email.value;
            this.password = password.value;
            this.first_name = first_name.value;
            this.last_name = last_name.value;
            console.log('this.email>............', this.email);
            if (this.email === '' ||  this.password === '' || this.first_name === '' || this.last_name === '') {
                this.singupError = 'These fields are required !!';
            } else {
                const  data = {
                    first_name : this.first_name ,
                    last_name : this.last_name,
                    email : this.email,
                    password : this.password
                };
                this._dashAuthService.signUpUser(data).subscribe(res => {
                    location.reload();
                    confirm('User created successfully');
                }, (err) => {
                    console.log('erro>>>>>>>>..', err);
                    console.log('erro>>>>>>>', err._body);
                    this.singupError = err._body;
                });
            }
        }
    }
