import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VentasComponent } from './pizzeria/ventas-component/ventas-component.component';
import { ResumenPedidoComponent } from './pizzeria/resumen-pedido/resumen-pedido.component';
import { VentasDelDiaComponent } from './pizzeria/ventas-del-dia/ventas-del-dia.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    VentasComponent,
    ResumenPedidoComponent,
    VentasDelDiaComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularSegundo';
}
