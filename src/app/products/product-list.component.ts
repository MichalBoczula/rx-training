import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProductCategory } from '../product-categories/product-category';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent
//  implements OnInit, OnDestroy  not need because declarative pattern
{
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];
  products$ = this.productService.products$;
  // sub!: Subscription; don't need because we have async obsrvable in pipe

  constructor(private productService: ProductService) { }

  // declaration of observable products are assigned to product$ variable
  // proceduralApproach can be still useful for reactive programming
  // actual is used declaritive pattern insted of life cycle
  // ngOnInit(): void {
  //   this.products$ = this.productService.getProducts()
  //     .pipe(
  //       catchError(error => {
  //         this.errorMessage = error;
  //         return EMPTY;
  //       })
  //     )
  // }

  //unsubscribe is usefull when we have subscription insted of async pipe
  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
