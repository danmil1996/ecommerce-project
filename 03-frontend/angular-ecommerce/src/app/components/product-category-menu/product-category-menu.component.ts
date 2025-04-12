import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: []
})
export class ProductCategoryMenuComponent implements OnInit {

  categoryList: ProductCategory[] = [];

  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.service.getProductCategoryList ().subscribe(
      data => this.categoryList = data
    );
  }

}
