import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map, tap } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';
  product: Product | null = null;

  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      tap(x => console.log(x)),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  pageTitle$ = this.product$
    .pipe(
      map(p => p ? `Product Details for: ${p.productName}` : null)
    )

  // to combine all observable to one view model
  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ]).pipe(
    filter(([prod]) => Boolean(prod)),
    map(([product, productSuppliers, pageTitle]) =>
      ({ product, productSuppliers, pageTitle }))
  );

  constructor(private productService: ProductService) { }

}
