import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute} from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/users.service';
import { DashAuthService } from '../../services/dashAuth.service';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  productList: any;
  current_user: any;
  check: any;
  _id: any;
  constructor(private route: ActivatedRoute, private _userService: UserService , private router: Router,
    private _productService: ProductService) { }

    ngOnInit() {
      this.current_user = JSON.parse(localStorage.getItem('current_user'));
      this.route.params.subscribe((params: any) => {
        this._id = params._id;
      });
      this._userService.getUserByEmail(this.current_user.email).subscribe(response => {
        this.check =  response[0];
      });
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
