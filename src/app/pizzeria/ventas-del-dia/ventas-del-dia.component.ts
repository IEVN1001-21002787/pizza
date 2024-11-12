// ventas-del-dia.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TransaccionesService } from '../../transacciones.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ventas-del-dia',
  templateUrl: './ventas-del-dia.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./ventas-del-dia.component.css'],
  standalone: true,
})
export class VentasDelDiaComponent implements OnInit {
  @ViewChild('ventasFecha') ventasFecha!: ElementRef;
  ventasDelDia: any[] = [];

  constructor(private transaccionesService: TransaccionesService) {}

  ngOnInit() {
    this.printUniversalVariables();
  }

  async fetchVentasDelDia() {
    const fecha = this.ventasFecha.nativeElement.value;
    const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    if (!validDays.includes(fecha)) {
      alert('Por favor, ingrese un día de la semana válido (Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo)');
      return;
    }

    console.log('Fetching ventas del día for', fecha);
    try {
      const ventas = await this.transaccionesService.fetchPedidos(fecha);
      this.ventasDelDia = ventas.map((venta: any) => ({
        ...venta,
        pedido: venta.Pedido
      }));
      this.transaccionesService.setVentasDelDia(this.ventasDelDia);
      console.log('Ventas del día fetched successfully', this.ventasDelDia);
    } catch (error) {
      console.error('Error fetching ventas del día', error);
      alert('Error al obtener las ventas del día');
    }
  }

  printUniversalVariables() {
    const ventasDelDia = this.transaccionesService.getVentasDelDia();
    console.log('Ventas del día en VentasDelDiaComponent:', ventasDelDia);
  }
}