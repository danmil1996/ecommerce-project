import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart-service.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: []
})
export class CartDetailsComponent implements OnInit {

  totalQuantity: number = 0;
  totalPrice: number = 0.00;
  cartItemList: CartItem[] = [];

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.setCartDetails();
  }

  setCartDetails(): void {
    this.cartItemList = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.calculateTotalPrice();
  }

  onIncrementQuatity (item: CartItem): void {
    this.cartService.addToCart(item);
  }
  onDecrementQuantity (item: CartItem): void {
    this.cartService.decrementItemQuantity(item);
  }

  onRemoveItem (item: CartItem): void {
    this.cartService.removeItem(item);
  }

}
