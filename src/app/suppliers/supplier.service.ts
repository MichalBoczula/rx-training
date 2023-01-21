import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable, of, map, concatMap, tap, mergeMap, switchMap, shareReplay, catchError } from 'rxjs';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'http://localhost:4201/api/suppliers';

  //wait to finsish first observable to start next one
  //Great when order has matter
  supliersConcatMap$ = of(1, 5, 8)
    .pipe(
      tap(x => console.log('concat map obj' + x)),
      concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    );

  //process observable paralle an merge result
  //The Best One order has NOT matter
  supliersMergeMap$ = of(1, 5, 8)
    .pipe(
      tap(x => console.log('merge map obj' + x)),
      mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    );

  //unsubscribe from prior inner observable to execute new one
  //required almost the same time of executino for example two get request
  //because when first one (outer) emit next value before inner one
  //than anuglar switch observable to first one 
  //and don't care about second observable result 
  supliersSwitchMap$ = of(1, 5, 8)
    .pipe(
      tap(x => console.log('switch map obj' + x)),
      switchMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    );

  suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl)
    .pipe(
      tap(data => console.log('suppliers', JSON.stringify(data))),
      shareReplay(1),
      catchError(this.handleError)
    );

  constructor(private http: HttpClient) {
    // this.supliersConcatMap$.subscribe(
    //   item => console.log('concat map result ' + item.name)
    // );
    // this.supliersMergeMap$.subscribe(
    //   item => console.log('merge map result ' + item.name)
    // )
    // this.supliersSwitchMap$.subscribe(
    //   item => console.log('switch map result ' + item.name)
    // )
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
