import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'pizzeria',
        loadChildren: () => import('./pizzeria/pizzeria.routes')
    },

];
