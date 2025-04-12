import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-status-component',
  templateUrl: './cart-status-component.component.html',
  styleUrls: []
})
export class CartStatusComponentComponent implements OnInit {

  totalQuantity: number = 0.00;
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
