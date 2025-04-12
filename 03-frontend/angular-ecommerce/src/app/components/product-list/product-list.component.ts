import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart-service.service';
import { GetResponseProducts, ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  productList: Product[] = [];
  curCategoryId: number = 0;
  prevCategoryId: number = 0;
  isModeSearch: boolean = false;

  // Pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  // Previous keyword for search to check if the search keyword is changed
  // and to reset the page number
  prvKeyword: string = '';

  constructor(
    private service: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit() {
    return this.route.paramMap.subscribe(() => this.listProducts());
  }

  onPageChange(event: any) {
    this.pageNumber = event.page;
    this.listProducts();
  }

  listProducts() {
    this.isModeSearch = this.route.snapshot.paramMap.has('keyword');
    if (this.isModeSearch) {
      this.manageSearchProducts();
    } else {
      this.manageListProducts();
    }
  } // listProducts

  manageSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword')!;
    if (keyword !== this.prvKeyword) {
      this.pageNumber = 1;
      this.prvKeyword = keyword;
    }
    return this.service.getSearchProductListPaginate(this.pageNumber, this.pageSize, keyword)
      .subscribe(data => this.processProductResponseData(data));
  } // manageSearchProducts

  manageListProducts() {
    this.setProductCategoryIdFromRoute();
    if (this.prevCategoryId !== this.curCategoryId) {
      this.pageNumber = 1;
      this.prevCategoryId = this.curCategoryId;
    }

    // this.pageNumber - 1  because Spring Data REST uses 0-based page number
    // and Angular uses 1-based page number
    return this.service.getProductListPaginate(this.pageNumber - 1,
      this.pageSize,
      this.curCategoryId
    ).subscribe(data => this.processProductResponseData(data));
  } // manageListProducts

  private setProductCategoryIdFromRoute(): void {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.curCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.curCategoryId = 1;
    }
  } // setProductCategoryId

  processProductResponseData(data: GetResponseProducts) {
    this.productList = data._embedded.products;
    this.pageNumber = data.page.number + 1;
    this.pageSize = data.page.size;
    this.totalElements = data.page.totalElements;
  } // processProductResponseData

  onPageSizeChange(sizeVal: string) {
    this.pageSize = +sizeVal;
    this.pageNumber = 1;
    this.listProducts();
  } // onPageSizeChange

  addToCart(prod: Product) {
    this.cartService.addToCartProd(prod);
  } // addToCart

}
