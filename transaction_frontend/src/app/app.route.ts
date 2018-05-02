import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponentComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TransactionComponent } from './components/transaction/transaction.component';
import { PublisherComponent } from './components/publisher/publisher.component';
import { AuthGuard } from './_guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponentComponent
  },
  {
    path: 'transactions',
    component: TransactionComponent
  },
  {
      path: 'publishers',
      component: PublisherComponent,
      canActivate: [AuthGuard]
  }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
