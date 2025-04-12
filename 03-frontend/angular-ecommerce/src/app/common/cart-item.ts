import { Product } from "./product";

export class CartItem {
    id: number;
    imageUrl: string;
    name: string;
    unitPrice: number;
    quantity: number

    constructor (prod: Product) {
        this.id = prod.id;
        this.imageUrl = prod.imageUrl;
        this.name = prod.name;
        this.unitPrice = prod.unitPrice;
        this.quantity = 1;
    }
}
