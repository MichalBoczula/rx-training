import { Component, OnInit } from '@angular/core';
import { of, from, tap, map, take } from 'rxjs';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    pageTitle = 'Acme Product Management';
  
    ngOnInit(): void {
      of(1, 2, 3, 4).subscribe({
        next: (item) => console.log(`... ${item}`),
        error: (err) => console.error(`... ${err}`),
        complete: () => console.log('rawrrr')
      })
      from([1, 2, 3, 4]).subscribe({
        next: (item) => console.log(`... ${item}`),
        error: (err) => console.error(`... ${err}`),
        complete: () => console.log('rawrrr')
      })
  
      from([1, 2, 3, 4, 5])
        .pipe(
          tap(ele => console.log(`orginal ${ele}`)),
          map(ele => ele * 2),
          map(ele => ele - 2),
          // map(ele => {
          //   if (ele === 0) {
          //     throw new Error('zero!!!')
          //   }
          // }),
          take(3)
        )
        .subscribe({
          next: (item) => console.log(`result ${item}`),
          error: (err) => console.error(`... ${err}`),
          complete: () => console.log('rawrrr')
        })
    }
  }