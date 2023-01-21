import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, filter, forkJoin, map, merge, Observable, of, scan, shareReplay, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { SupplierService } from '../suppliers/supplier.service';
import { Supplier } from '../suppliers/supplier';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'http://localhost:4201/api/products';
  private suppliersUrl = 'http://localhost:4201/api/suppliers';

  products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      map(products =>
        products.map(prod => ({
          ...prod,
          price: prod.price ? prod.price * 1.5 : 0,
          searchKey: [prod.productName]
        } as Product))),
      tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );

  productsWithCategories$ = combineLatest([
    this.products$,
    this.productCategoryService.productCategories$
  ]).pipe(
    map(([products, categories]) =>
      products.map(prod => ({
        ...prod,
        price: prod.price ? prod.price * 1.5 : 0,
        category: categories.find(x => x.id === prod.categoryId)?.name,
        searchKey: [prod.productName]
      } as Product)),
      shareReplay(1)
    )
  );

  private selectedProductSubject = new BehaviorSubject<number>(0);
  selectedProductAction$ = this.selectedProductSubject.asObservable();

  selectedProduct$ = combineLatest([
    this.productsWithCategories$,
    this.selectedProductAction$
  ])
    .pipe(
      map(([products, selectedProductId]) =>
        products.find(x => x.id === selectedProductId)),
      shareReplay(1)
    );

  private addedProductSubject = new Subject<Product>();
  addedProductAction$ = this.addedProductSubject.asObservable();

  productsWithAddedOne$ = merge(
    this.productsWithCategories$,
    this.addedProductAction$
  )
    .pipe(
      tap(x => console.log(x)),
      scan((acc, value) => value instanceof Array ? [...value] : [...acc, value], [] as Product[])
    )

  selectedProductSuppliers$ = combineLatest([
    this.selectedProduct$,
    this.supplierService.suppliers$
  ]).pipe(
    map(([selectedProduct, suppliers]) =>
      suppliers.filter(supp => selectedProduct?.supplierIds?.includes(supp.id))
    )
  );

  // selectedProductSuppliers$ = this.selectedProduct$
  //   .pipe(
  //     filter(prod => Boolean(prod)),
  //     switchMap(selectedProd => {
  //       if (selectedProd?.supplierIds) {
  //         return forkJoin(selectedProd.supplierIds.map(
  //           suppId => this.http.get<Supplier>(`${this.suppliersUrl}/${suppId}`)
  //         ))
  //       }
  //       else {
  //         return of([]);
  //       }
  //     }),
  //     tap(s => console.log('prod supp', JSON.stringify(s)))
  //   )

  constructor(private http: HttpClient,
    private productCategoryService: ProductCategoryService,
    private supplierService: SupplierService) { }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  addProduct(addedProduct?: Product): void {
    addedProduct = addedProduct || this.fakeProduct();
    this.addedProductSubject.next(addedProduct);
  }

  selectedProductChange(selectedProductId: number): void {
    this.selectedProductSubject.next(selectedProductId);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}
