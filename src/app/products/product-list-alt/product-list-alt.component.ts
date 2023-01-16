import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html'
})
export class ProductListAltComponent
// implements OnInit, OnDestroy here is implemented declarative pattern insted of proceduralApproach
{
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;
  products$ = this.productService.products$;

  constructor(private productService: ProductService) { }

  //the same issuelike in list component
  // ngOnInit(): void {
  //   this.sub = this.productService.getProducts().subscribe({
  //     next: products => this.products = products,
  //     error: err => this.errorMessage = err
  //   });
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
