import { Routes } from '@angular/router';

export default [
    {
        path: 'pizza',
        loadComponent: () => import('./ventas-component/ventas-component.component').then(m => m.VentasComponent),
    },
    {
        path: 'pedido',
        loadComponent: () => import('./resumen-pedido/resumen-pedido.component').then(m => m.ResumenPedidoComponent),
    },
    {
        path: 'ventas',
        loadComponent: () => import('./ventas-del-dia/ventas-del-dia.component').then(m => m.VentasDelDiaComponent),
    },
] as Routes;