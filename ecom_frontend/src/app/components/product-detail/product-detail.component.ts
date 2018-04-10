import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/users.service';
import { DashAuthService } from '../../services/dashAuth.service';
import { StorageService } from '../../services/storage.service';
import { CodeConstants } from '../../code_constant';
import { FlashMessagesService } from 'angular2-flash-messages';
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
    statte: any = false;
    email: any;
    password: any;
    loader: any = false;
    filedata: any;
    orderModel: any = {};
    zoomedImageSrc: any;
    checkAdmin: boolean;
    orderError: any;
    flag: any = false;
    priceDecimalValue: any;
    @ViewChild('closeBtn') closeBtn: ElementRef;
    constructor(private route: ActivatedRoute, private router: Router, private _productService: ProductService,
        private _flashMessagesService: FlashMessagesService, private _userService: UserService ,
        private _dashAuthService: DashAuthService, private _storageService: StorageService) { }

        ngOnInit() {
            this.current_user = JSON.parse(localStorage.getItem('current_user'));
            this.route.params.subscribe((params: any) => {
                this._id = params._id;
                this.getOneProduct();
            });
            if  (this.current_user ) {
                this._userService.getUserByEmail(this.current_user.email).subscribe(response => {
                    this.check =  response[0];
                    if (this.check.roles === 'admin') {
                        this.checkAdmin = true;
                    } else {
                        this.checkAdmin = false;
                    }
                });
            }
        }

        getOneProduct() {
            this._productService.getOneProduct(this._id).subscribe(res => {
                this.product = res[0];
                this.priceDecimalValue = CodeConstants.DECIMAL;
                const that = this ;
                ipfs.files.cat(this.product.descLink, function (err, file) {
                    that.filedata = file;
                });
            }, (err) => {
                console.log('error....', err);
            });
        }

        // create order
        createOrder(form) {
            const that = this;
            if (form.address === undefined || form.pincode === undefined || form.state === undefined ||
                form.phone_number === undefined || form.city === undefined) {
                    this.orderError = 'All these fields are required !!';
                    that.flag = true;
                    setTimeout(function() {
                        that.flag = false;
                    }, 3000);
                } else {
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
                            this.closeBtn.nativeElement.click();
                            this._flashMessagesService.show('Order placed successfully and it will be available soon!!',
                            { cssClass: 'alert-success', timeout: 4000, showCloseBtn: true });
                            this.orderModel = {};
                            setTimeout(() => {
                                this.router.navigate(['/']);
                            }, 4000);
                        }
                    }, (err) => {
                        this.loader = false;
                        this.orderError = err.error.replace(/"/g, '');
                        this.flag = true;
                        setTimeout(function() {
                            that.flag = false;
                        }, 3000);
                    });
                }
            }
        }
