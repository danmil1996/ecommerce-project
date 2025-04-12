import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }


  addToCartProd (prod: Product) {
    const cartItem = new CartItem(prod);
    this.addToCart (cartItem);
  }

  addToCart (cartItem: CartItem) {
    const existentItem = this.cartItems.find(item => item.id === cartItem.id);
    if (existentItem) {
      existentItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    } 
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let item of this.cartItems) {
      totalPriceValue += item.unitPrice * item.quantity;
      totalQuantityValue += item.quantity;
    } // for

    // publish new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  removeItem(item: CartItem) {
    const idx = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (idx<0) { return; }
    this.cartItems.splice(idx, 1);
    this.calculateTotalPrice();
  }

  decrementItemQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity --;
      this.calculateTotalPrice();
    } else {
      this.removeItem (item);
    }
  }
  
}
