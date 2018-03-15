import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

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
    this.file =  event.target.files[0];
  }

  createProduct(data) {
    this._productService.createProduct(data, this.file).subscribe(res => {
      this.data = res[0];
    });
  }
}