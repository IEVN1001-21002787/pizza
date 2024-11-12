// ventas-component.component.ts
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

@Component({
  selector: 'app-ventas-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas-component.component.html',
  styleUrls: ['./ventas-component.component.css'],
  standalone: true,
})
export class VentasComponent implements OnInit {
  formGroup!: FormGroup;
  toppingOptions = ['Ham', 'Pineapple', 'Mushrooms'];
  sizeOptions = ['Small', 'Medium', 'Large'];
  orders: PizzaOrder[] = [];

  constructor(private fb: FormBuilder, private transaccionesService: TransaccionesService) {}

  ngOnInit() {
    this.initForm();
    this.loadCurrentOrder();
  }

  private initForm() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    this.formGroup = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      purchaseDate: [{ value: currentDate, disabled: false }, Validators.required],
      size: ['', Validators.required],
      toppings: this.fb.group({
        Ham: [false],
        Pineapple: [false],
        Mushrooms: [false]
      }),
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  private calculatePrice(size: string, toppings: string[], quantity: number): number {
    let price = 0;
    switch (size) {
      case 'Small':
        price = 40;
        break;
      case 'Medium':
        price = 80;
        break;
      case 'Large':
        price = 120;
        break;
    }
    price += toppings.length * 10;
    return price * quantity;
  }

  onSubmit() {
    const validDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const purchaseDate = this.formGroup.get('purchaseDate')?.value;

    if (!validDays.includes(purchaseDate)) {
      alert('Por favor, ingrese un día de la semana válido (Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo)');
      return;
    }

    if (this.formGroup.valid) {
      const selectedToppings = Object.entries(this.formGroup.value.toppings)
        .filter(([_, selected]) => selected)
        .map(([topping]) => topping);

      const order: PizzaOrder = {
        fullName: this.formGroup.value.fullName,
        address: this.formGroup.value.address,
        phone: this.formGroup.value.phone,
        purchaseDate: this.formGroup.get('purchaseDate')?.value,
        pedido: {
          size: this.formGroup.value.size,
          toppings: selectedToppings,
          quantity: this.formGroup.value.quantity
        },
        price: this.calculatePrice(this.formGroup.value.size, selectedToppings, this.formGroup.value.quantity)
      };

      const total = order.price;

      if (confirm(`El total del pedido es ${total}. ¿Es correcto?`)) {
        if (this.orders.length > 0) {
          const lastOrder = this.orders[0];
          if (
            lastOrder.fullName !== order.fullName ||
            lastOrder.address !== order.address ||
            lastOrder.phone !== order.phone ||
            lastOrder.purchaseDate !== order.purchaseDate
          ) {
            alert('Termina el pedido actual primero');
            return;
          }
        }

        this.orders.push(order);
        this.transaccionesService.setCurrentOrder(this.orders);
        console.log('Order added successfully', order);

        // Reset only pizza-specific fields, keeping customer information
        this.formGroup.patchValue({
          size: '',
          toppings: {
            Ham: false,
            Pineapple: false,
            Mushrooms: false
          },
          quantity: 1
        });
      } else {
        console.log('Order not confirmed');
      }
    } else {
      console.warn('Form is invalid');
    }
  }

  private loadCurrentOrder() {
    const orders = this.transaccionesService.getCurrentOrder();
    if (orders) {
      this.orders = orders;
      const lastOrder = orders[orders.length - 1];
      this.formGroup.patchValue({
        fullName: lastOrder.fullName,
        address: lastOrder.address,
        phone: lastOrder.phone,
        purchaseDate: lastOrder.purchaseDate,
        size: lastOrder.pedido.size,
        toppings: {
          Ham: lastOrder.pedido.toppings.includes('Ham'),
          Pineapple: lastOrder.pedido.toppings.includes('Pineapple'),
          Mushrooms: lastOrder.pedido.toppings.includes('Mushrooms')
        },
        quantity: lastOrder.pedido.quantity
      });
      console.log('Current orders loaded:', orders);
    }
  }
}