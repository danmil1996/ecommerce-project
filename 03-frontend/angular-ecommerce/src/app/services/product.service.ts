import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private basetUrl: string = environment.dmShopApiUrl + '/products';
  private categoryUrl: string = environment.dmShopApiUrl + '/product-category';

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
