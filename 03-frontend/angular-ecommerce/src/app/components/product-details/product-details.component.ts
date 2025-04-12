import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: []
})
export class ProductDetailsComponent implements OnInit {

  product: Product | null = null;

  constructor(
    private service: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.productDetails());
  }

  productDetails() {
    var hasId = this.route.snapshot.paramMap.has('id');
    if (hasId) {
      var id = +this.route.snapshot.paramMap.get('id')!;
      if (id > 0) {
        this.service.getProductDetails(id).subscribe(
          data => this.product = data,
        );
      } else {
        this.product = null;
      }
    } else {
      this.product = null;
    }
  }

  addToCart (product: Product | null) {
    if (!product) { return;}
    this.cartService.addToCartProd(product);
  }

}
