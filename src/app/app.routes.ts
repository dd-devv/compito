import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/public/layout/layout.component';
import { requireVerificacionGuard, verificacionGuard } from './modules/auth/guards/verificacion.guard';
import { authenticatedUserGuard, authUserGuard } from './modules/auth/guards/user.guard';
import LayoutAdminComponent from './modules/admin/layout-admin/layout-admin.component';
import { adminGuard } from './modules/auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/public/pages/home/home.component'),
      },
      {
        path: 'about',
        loadComponent: () => import('./modules/public/pages/about/about.component'),
      },
      {
        path: 'plans',
        loadComponent: () => import('./modules/public/pages/plans/plans.component'),
      },
      {
        path: 'contact',
        loadComponent: () => import('./modules/public/pages/contact/contact.component'),
      },
      {
        path: 'faqs',
        loadComponent: () => import('./modules/public/pages/faqs/faqs.component'),
      },
      {
        path: 'tutorials',
        loadComponent: () => import('./modules/public/pages/tutorials/tutorials.component'),
      },
      {
        path: 'login',
        loadComponent: () => import('./modules/auth/login/login.component'),
        canActivate: [authUserGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./modules/auth/register/register.component'),
        canActivate: [authUserGuard]
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./modules/auth/forgot-password/forgot-password.component'),
        canActivate: [authUserGuard]
      },
      {
        path: 'reset-password/:token',
        loadComponent: () => import('./modules/auth/reset-password/reset-password.component'),
        canActivate: [authUserGuard]
      },
      {
        path: 'verify-whatsapp',
        loadComponent: () => import('./modules/auth/verify-whatsapp/verify-whatsapp.component'),
        canActivate: [requireVerificacionGuard, authUserGuard]
      },

      //Rutas para usuario autenticado
      {
        path: 'seguimientos',
        loadComponent: () => import('./modules/user/products/products.component'),
        canActivate: [authenticatedUserGuard]
      },
      {
        path: 'datos',
        loadComponent: () => import('./modules/user/datos/datos.component'),
        canActivate: [authenticatedUserGuard]
      },
      {
        path: 'seguimientos/:id',
        loadComponent: () => import('./modules/user/product/product.component'),
      },
      {
        path: 'ofertas',
        loadComponent: () => import('./modules/user/offers/offers.component')
      },
      {
        path: 'ofertas/:urlId',
        loadComponent: () => import('./modules/user/offer/offer.component')
      },
      {
        path: 'productos',
        loadComponent: () => import('./modules/user/products-all/products-all.component')
      },
      {
        path: 'notificaciones',
        loadComponent: () => import('./modules/user/notifications/notifications.component'),
        canActivate: [authenticatedUserGuard]
      },
      {
        path: 'categorias',
        loadComponent: () => import('./modules/user/categorys/categorys.component'),
        canActivate: [authenticatedUserGuard]
      },
      {
        path: 'search',
        loadComponent: () => import('./modules/user/search-results/search-results.component')
      }
    ]
  },
  // {
  //   path: 'verify-whatsapp',
  //   loadComponent: () => import('./modules/auth/verify-whatsapp/verify-whatsapp.component'),
  //   canActivate: [requireVerificacionGuard]
  // },
  {
    path: 'admin',
    component: LayoutAdminComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/admin/pages/home-admin/home-admin.component'),
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/admin/pages/users/users.component'),
      },
      {
        path: 'searches',
        loadComponent: () => import('./modules/admin/pages/searches/searches.component'),
      },
      {
        path: 'tracks',
        loadComponent: () => import('./modules/admin/pages/tracks/tracks.component'),
      },
      {
        path: 'messages',
        loadComponent: () => import('./modules/admin/pages/messages/messages.component'),
      },
      {
        path: 'views',
        loadComponent: () => import('./modules/admin/pages/views/views.component'),
      },
      {
        path: 'buys',
        loadComponent: () => import('./modules/admin/pages/buys/buys.component'),
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
