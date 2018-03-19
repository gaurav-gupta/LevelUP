import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.route';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './components/login/login.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';
import { DataTableModule } from 'angular2-datatable';
import { OrderComponent } from './components/order/order.component';
import { DataFilterPipe } from './directives/data-filter.pipe';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthGuard } from './_guards/auth.guard';
// import { NG2DataTableModule } from 'angular2-datatable-pagination';
import { ImageZoomModule } from 'angular2-image-zoom';
import { StorageService } from './services/storage.service';
import { UserOrderComponent } from './components/user-order/user-order.component';
import { DashAuthService } from './services/dashAuth.service';
import { UserService } from './services/users.service';
import { ProductService } from './services/product.service';
import { AdminProductComponent } from './components/admin-product/admin-product.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    ProductComponent,
    ProductDetailComponent,
    NavBarComponent,
    AdminComponent,
    OrderComponent, DataFilterPipe, UserOrderComponent, AdminProductComponent
  ],
  imports: [
    BrowserModule, routing, FormsModule, DataTableModule, ImageZoomModule, HttpClientModule, HttpModule
  ],
  providers: [ appRoutingProviders , StorageService, AuthGuard,
      {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  }, DashAuthService, UserService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
