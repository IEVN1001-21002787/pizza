// resumen-pedido.component.ts
import { Component, OnInit } from '@angular/core';
import { TransaccionesService } from '../../transacciones.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface PizzaOrder {
  id?: number;
  fullName: string;
  address: string;
  phone: string;
  purchaseDate: string;
  pedido: {
    size: string;
    toppings: string[];
    quantity: number;
  };
  price: number;
}

interface Pedido {
  fecha_pedido: string;
  nombre: string;
  direccion: string;
  telefono: string;
  Pedido: PizzaOrder[];
  total: number;
}

@Component({
  selector: 'app-resumen-pedido',
  templateUrl: './resumen-pedido.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./resumen-pedido.component.css'],
  standalone: true,
})
export class ResumenPedidoComponent implements OnInit {
  orders: PizzaOrder[] = [];
  totalPrice: number = 0;

  constructor(private transaccionesService: TransaccionesService) {}

  ngOnInit() {
    this.loadOrders();
    this.transaccionesService.data$.subscribe(data => {
      console.log('Data from service:', data);
      const orders = this.transaccionesService.getCurrentOrder();
      if (orders) {
        this.orders = orders;
        this.totalPrice = this.orders.reduce((total, order) => total + order.price, 0);
        console.log('Orders added to ResumenPedido:', orders);
      } else {
        console.log('No orders found in data');
      }
    });
  }

  removeOrder(index: number) {
    this.totalPrice -= this.orders[index].price;
    this.orders.splice(index, 1);
    this.transaccionesService.setCurrentOrder(this.orders);
    console.log('Order removed successfully', index);
  }

  async submitOrder() {
    if (this.orders.length > 0) {
      const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const purchaseDate = this.orders[0].purchaseDate;

      if (!validDays.includes(purchaseDate)) {
        alert('Por favor, ingrese un día de la semana válido (Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo)');
        return;
      }

      const pedido: Pedido = {
        fecha_pedido: purchaseDate,
        nombre: this.orders[0].fullName,
        direccion: this.orders[0].address,
        telefono: this.orders[0].phone,
        Pedido: this.orders,
        total: this.totalPrice
      };

      try {
        const response = await this.transaccionesService.addPedido(pedido);
        if (response.exito) {
          alert('Pedido guardado con éxito');
          this.orders = []; // Clear orders after successful submission
          this.totalPrice = 0; // Reset total price
          this.transaccionesService.setCurrentOrder(null); // Clear current order in service
        } else {
          alert('Error al guardar el pedido');
        }
      } catch (error) {
        console.error('Error saving order:', error);
        alert('Error al guardar el pedido');
      }
    } else {
      alert('No hay pedidos para enviar');
    }
  }

  private loadOrders() {
    const orders = this.transaccionesService.getCurrentOrder();
    if (orders) {
      this.orders = orders;
      this.totalPrice = this.orders.reduce((total, order) => total + order.price, 0);
      console.log('Orders loaded:', this.orders);
    }
  }
}