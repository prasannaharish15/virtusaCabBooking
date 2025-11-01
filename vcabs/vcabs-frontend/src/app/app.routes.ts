import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth', 
        loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
    },
    {
        path: 'driver',
        loadChildren: () => import('./features/driver/driver-module').then(m => m.DriverRoutingModule)
    },
    {
        path: 'passenger',
        loadChildren: () => import('./features/passenger/passenger-module').then(m => m.PassengerModule)
    },
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    }
];
