import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CodeConstants } from '../../code_constant';
import * as ipfsAPI from 'ipfs-api';
import * as buffer from 'buffer';
const Buffer1 = buffer.Buffer;
import { FlashMessagesService } from 'angular2-flash-messages';
const ipfs = ipfsAPI({host: '13.250.35.159', port: '5001', protocol: 'http'});

@Component({
    selector: 'app-admin-product',
    templateUrl: './admin-product.component.html',
    styleUrls: ['./admin-product.component.css']
})

export class AdminProductComponent implements OnInit {
    data: any;
    Categories: any;
    file: any;
    reader: any;
    formData: any;
    xhr: any;
    loader = false;
    productModel: any = {
        'product_name': '',
        'selectName': '',
        'descripton': '',
        'Price': ''
    };
    productError: any;
    flag: any = false;
    priceDecimalValue: any;
    @ViewChild('closeBtn') closeBtn: ElementRef;
    @ViewChild('myImageFile') myImageFile: any;
    constructor(private _productService: ProductService, private _flashMessagesService: FlashMessagesService) { }

    ngOnInit() {
        this.getCategories();
        this.getproducts();
    }

    getCategories() {
        this._productService.getCategories().subscribe(res => {
            if (res) {
                this.Categories = res;
            }
        });
    }

    getproducts() {
        this._productService.getProduct().subscribe(res => {
            this.data = res;
            this.priceDecimalValue = CodeConstants.DECIMAL;
        });
    }

    changeListener(event) {
        this.file = event.target.files[0];
    }

    createProduct(data) {
        const that = this;
        if (data.product_name === '' || data.selectName === '' || data.descripton === '' || data.Price === '') {
            this.productError = 'All these fields are required !!';
            this.flag = true;
            setTimeout(function(){
                that.flag = false;
            }, 3000);
        } else {
            this.loader = true;
            const file = this.file;
            const reader = new FileReader();
            reader.onloadend = function() {
                const buf = Buffer1.from(reader.result);
                ipfs.files.add(buf).then((response) => {
                    const buf1 = Buffer1.from(data.descripton);
                    ipfs.files.add(buf1).then((resp) => {
                        data.imageLink = response[0].hash;
                        data.descLink = resp[0].hash;
                        that._productService.createProduct(data).subscribe(res => {
                            if (res) {
                                that.loader = false;
                                that._flashMessagesService.show('Product Created Successfully !!',
                                { cssClass: 'alert-success', timeout: 7000 });
                                that.closeBtn.nativeElement.click();
                                that.productModel = {
                                    'selectName': 'Select the Categories'
                                };
                                that.myImageFile.nativeElement.value = '';
                                that.getproducts();
                            }
                        }, (err) => {
                            console.log('error..1..', err);
                            that.loader = false;
                            that.productError = err.error.replace(/"/g, '');
                            that.flag = true;
                            setTimeout(function() {
                                that.flag = false;
                            }, 3000);
                        });
                    }, (err) => {
                        console.log('error 2....', err);
                        that.loader = false;
                        that.productError = err.error.replace(/"/g, '');
                        that.flag = true;
                        setTimeout(function() {
                            that.flag = false;
                        }, 3000);
                    });
                }, (err) => {
                    console.log('error.3...', err);
                    that.loader = false;
                    that.productError = err.error.replace(/"/g, '');
                    that.flag = true;
                    setTimeout(function() {
                        that.flag = false;
                    }, 3000);
                });
            };
            reader.readAsArrayBuffer(file);
        }
    }
}
