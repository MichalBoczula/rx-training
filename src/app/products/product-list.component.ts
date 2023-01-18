import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, startWith } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent
//  implements OnInit 
//  OnDestroy  not need because declarative pattern
{
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsWithAddedOne$,
    this.categorySelectedAction$
  ])
    .pipe(
      map(([products, selectedCategoryId]) =>
        products.filter(prod => selectedCategoryId ?
          selectedCategoryId === prod.categoryId : true)),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err
        return EMPTY
      })
    )
  // sub!: Subscription don't need because we have async obsrvable in pipe

  constructor(private productService: ProductService,
    private productCategoryService: ProductCategoryService) { }

  // declaration of observable products are assigned to product$ variable
  // proceduralApproach can be still useful for reactive programming
  // actual is used declaritive pattern insted of life cycle
  // ngOnInit(): void {
  //   this.productService.productsWithCategories$.subscribe( ele => console.log(ele));
  // }

  //unsubscribe is usefull when we have subscription insted of async pipe
  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
