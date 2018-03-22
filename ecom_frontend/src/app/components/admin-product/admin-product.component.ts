import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import * as ipfsAPI from 'ipfs-api';
import * as buffer from 'buffer';
const Buffer1 = buffer.Buffer;
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
    productModel: any = {};
    productError: any;
    flag: any = false;
    constructor(private _productService: ProductService) { }

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
        });
    }
    changeListener(event) {
        this.file = event.target.files[0];
    }

    createProduct(data) {
        const that = this;
        console.log('data>>>>>>>>>>>>..', data);
        if (Object.keys(data).length === 0) {
            this.productError = 'All these fields are required !!';
            this.flag = true;
            setTimeout(function(){
                console.log(that.flag);
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
                                console.log('response>>>>>>>>>>>>.', res);
                                that.loader = false;
                                confirm('Create Successfully');
                                location.reload();
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            };
            reader.readAsArrayBuffer(file);
        }
    }
}
