import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  productList: any;
  constructor(private router: Router, private _productService: ProductService) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this._productService.getProduct().subscribe(res => {
      this.productList = res;
    }, (err) => {
      console.log('error>>>>>>>>>>>>', err);
    });
  }

  productDetail() {
    this.router.navigate(['/productDetail']);
  }
}