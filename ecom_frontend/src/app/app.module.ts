import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.route';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './components/login/login.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin/admin.component';
import { DataTableModule } from 'angular2-datatable';
import { OrderComponent } from './components/order/order.component';
import { DataFilterPipe } from './directives/data-filter.pipe';
import { ApprovedPipe } from './directives/approved.pipe';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthGuard } from './_guards/auth.guard';
import { ImageZoomModule } from 'angular2-image-zoom';
import { StorageService } from './services/storage.service';
import { PublisherService } from './services/publisher.service';
import { UserOrderComponent } from './components/user-order/user-order.component';
import { DashAuthService } from './services/dashAuth.service';
import { UserService } from './services/users.service';
import { ProductService } from './services/product.service';
import { AdminProductComponent } from './components/admin-product/admin-product.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { UserTransactionComponent } from './components/user-transaction/user-transaction.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponentComponent,
        ProductDetailComponent,
        NavBarComponent,
        AdminComponent,
        OrderComponent,
        DataFilterPipe,
        ApprovedPipe,
        UserOrderComponent,
        AdminProductComponent,
        UserTransactionComponent
    ],
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        DataTableModule,
        ImageZoomModule,
        HttpClientModule,
        HttpModule,
        EditorModule,
        FlashMessagesModule.forRoot()
    ],
    providers: [
        appRoutingProviders ,
        StorageService,
        AuthGuard,

        DashAuthService,
        UserService,
        ProductService,
        PublisherService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
