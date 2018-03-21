import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponentComponent } from './components/login/login.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AdminComponent } from './components/admin/admin.component';
import { OrderComponent } from './components/order/order.component';
import { UserOrderComponent } from './components/user-order/user-order.component';
import { AdminProductComponent } from './components/admin-product/admin-product.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: LoginComponentComponent
  },
  {
    path: 'productDetail/:_id',
    component: ProductDetailComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'userOrder',
    component: UserOrderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adminproduct',
    component: AdminProductComponent,
    canActivate: [AuthGuard]
  }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
