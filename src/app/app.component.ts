import { Component, OnInit } from '@angular/core';
import { from, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rx-training';

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
  }
}
