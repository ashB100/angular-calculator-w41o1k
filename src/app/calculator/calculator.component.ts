import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { Subject, fromEvent } from "rxjs";
import { map, reduce, scan } from "rxjs/operators";

@Component({
  selector: "app-calculator",
  templateUrl: "./calculator.component.html",
  styleUrls: ["./calculator.component.css"]
})
export class CalculatorComponent implements OnInit {
  @ViewChild("number") number;

  text;
  digit$;

  // digitSubject = new Subject<number>();
  // digit$ = this.digitSubject.asObservable();
  // operatorSubject = new Subject<string>();
  // operator$ = this.operatorSubject.asObservable();
  // clearSubject = new Subject<boolean>();
  // clear$ = this.clearSubject.asObservable();

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {

    // this.num$ = fromEvent(this.number.nativeElement, 'click')
    //   .subscribe(value => this.num = value.target.textContent);


    // this.digit$ = fromEvent(this.number.nativeElement, "click").pipe(
    //   map(event => event.target.textContent),
    //   reduce((acc, curr) => {
    //     console.log("acc", acc);
    //     console.log("curr", curr);
    //     return acc + curr;
    //   }, "")
    // ).subscribe(value => this.text = value);

    this.digit$ = fromEvent(this.number.nativeElement, 'click')
      .pipe(
        map(event => event.target.textContent),
        scan((acc, curr) => {
          if (curr === '.') {
            // is it a decimal?
            let digit = parseFloat(acc);
            if (Math.floor(digit) !== digit) {
              return acc;
            }
          }
          return acc + curr;
        }, '')
      )
  
  }


}

/*TODO: 
1. Reduce display text font when length is long
2. Disable decimal point when its already a decimal number
*/
