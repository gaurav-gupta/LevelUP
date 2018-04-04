import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DashAuthService } from './services/dashAuth.service';
import { UserService } from './services/users.service';
import { StorageService } from './services/storage.service';
import { ProductService } from './services/product.service';
import { FlashMessagesService } from 'angular2-flash-messages';

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
    flag: any = false;
    @ViewChild('closeBtnLogin') closeBtnLogin: ElementRef;
    @ViewChild('closeBtnSignUp') closeBtnSignUp: ElementRef;
    constructor(private route: ActivatedRoute, private router: Router, private _dashAuthService: DashAuthService,
        private _storageService: StorageService, private _userService: UserService,
        private _productService: ProductService, private _flashMessagesService: FlashMessagesService)  { }

        ngOnInit() {
            this.getProducts();
            this.current_user = JSON.parse(localStorage.getItem('current_user'));
            if (this.current_user) {
                this.check = true;
            }
        }

        // Authenticate user
        login(email1, password1) {
            const that = this;
            this.email = email1.value;
            this.password = password1.value;
            if (this.email === '' ||  this.password === '') {
                this.loginError = 'Email/Password are required !!';
                this.flag = true;
                setTimeout(function(){
                    that.flag = false;
                }, 3000);
            } else {
                const data = {
                    email: this.email,
                    password: this.password
                };
                this._dashAuthService.loginDashUser(data).subscribe(res => {
                    if (!res.error) {
                        this._storageService.setItem('current_user', JSON.stringify(res));
                        const currentUser = JSON.parse(localStorage.getItem('current_user'));
                        this._userService.getUserByEmail(currentUser.email).subscribe(res1 => {
                            if (res1[0].roles === 'admin') {
                                this.closeBtnLogin.nativeElement.click();
                                this.router.navigate(['/admin']);
                            } else {
                                this.closeBtnLogin.nativeElement.click();
                                location.reload();
                                this.router.navigate(['/']);
                            }
                        });
                    }
                }, (err) => {
                    this.loginError = err._body.replace(/"/g, '');
                    this.flag = true;
                    setTimeout(function() {
                        that.flag = false;
                    }, 3000);
                });
            }
        }

        // get list of products
        getProducts() {
            this._productService.getProduct().subscribe(res => {
                this.product = res;
            });
        }

        // create User
        signUp(first_name, last_name, email, password) {
            const that = this;
            this.email = email.value;
            this.password = password.value;
            this.first_name = first_name.value;
            this.last_name = last_name.value;
            const filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
            if (!filter.test(this.email)) {
                this.singupError = 'Invalid Email Address !!';
                this.flag = true;
                setTimeout(function(){
                    that.flag = false;
                }, 3000);
            } else if (this.email === '' ||  this.password === '' || this.first_name === '' || this.last_name === '') {
                this.singupError = 'All these fields are required !!';
                this.flag = true;
                setTimeout(function() {
                    that.flag = false;
                }, 3000);
            } else {
                const  data = {
                    first_name : this.first_name ,
                    last_name : this.last_name,
                    email : this.email,
                    password : this.password
                };
                this._dashAuthService.signUpUser(data).subscribe(res => {
                    this._flashMessagesService.show('User created successfully !!', { cssClass: 'alert-success', timeout: 4000 });
                    this.closeBtnSignUp.nativeElement.click();
                    email.value = '';
                    password.value = '';
                    first_name.value = '';
                    last_name.value = '';
                }, (err) => {
                    this.singupError = err._body.replace(/"/g, '');
                    this.flag = true;
                    setTimeout(function() {
                        that.flag = false;
                    }, 3000);
                });
            }
        }
    }
