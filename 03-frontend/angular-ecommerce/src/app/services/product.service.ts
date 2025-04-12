import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { map, Observable, of } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private basetUrl: string = 'http://localhost:8080/api/products';
  private categoryUrl: string = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  /* PRODUCT CATEGORY */ 
  getProductCategoryList (): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }


  /* PRODUCT */
  getProductList(catId: number): Observable<Product[]> {
    const searchUrl = `${this.basetUrl}/search/findByCategoryId?id=${catId}`;
    return this.getProductListByUrl(searchUrl);
  }

  getProductListPaginate(page: number, 
                         size: number, 
                         catId: number): Observable<GetResponseProducts> {
    // http://localhost:8080/api/products/search/findByCategoryId?id=1&page=0&size=10
    const searchUrl = `${this.basetUrl}/search/findByCategoryId?id=${catId}`
                    + `&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getSearchProductListPaginate(page: number, 
                               size: number,
                              keyword: string): Observable<GetResponseProducts> {
    const searchUrl: string = this.basetUrl + `/search/findByNameContaining?name=${keyword}`
                            + `&page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductListByUrl(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductDetails(id: number): Observable<Product> {
    const productUrl = `${this.basetUrl}/${id}`;
    return this.httpClient.get<Product>(productUrl);
  }

}

export interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
