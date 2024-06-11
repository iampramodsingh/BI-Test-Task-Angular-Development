import { group } from '@angular/animations';
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthenticationComponent } from './components/authentication/authentication.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/authentication/authentication.component').then(
        (c) => c.AuthenticationComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/layout/layout.component').then(
        (c) => c.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./components/groups/groups.component').then(
            (c) => c.GroupsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      {
        path: 'transactions/:groupId',
        loadComponent: () =>
          import('./components/transaction/transaction.component').then(
            (c) => c.TransactionComponent
          ),
      },
      {
        path: 'transactions-details/:transactionId',
        loadComponent: () =>
          import('./components/transaction-deatils/transaction-deatils.component').then(
            (c) => c.TransactionDeatilsComponent
          ),
        
      },
    ],
    canActivate: [authGuard]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login',
  }
];
