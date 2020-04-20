import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { Subject, fromEvent } from "rxjs";
import { map, reduce, scan } from "rxjs/operators";

@Component({
  selector: "app-calculator",
  templateUrl: "./calculator.component.html",
  styleUrls: ["./calculator.component.css"]
})
export class CalculatorComponent implements OnInit {
  @ViewChild("container") container;
  input$;
  multiply = '×';
  divide = '÷';
  add = '+';
  subtract = '-';

  currentNumber = '';
  operators = [];
  numbers = [];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {

    this.input$ = fromEvent(this.container.nativeElement, 'click')
      .pipe(
        map(event => event.target.textContent)
      )
      .subscribe(value => {
        switch (value) {
          case '1':
          case '2':
          case '3': 
          case '4': 
          case '5':
          case '6': 
          case '7': 
          case '9':
          case '0':
            this.currentNumber = this.currentNumber + value;
            console.log('clicked', value)
            break; 

          case '.': 
            if (!this.currentNumber.includes('.')) {
              this.currentNumber = this.currentNumber + value;
            }
            break;

          case this.add:
          case this.subtract:
          case this.multiply:
          case this.divide:
            // add current number
            if (this.currentNumber) {
              this.currentNumber = this.currentNumber.replace(/^0+/, '');
              this.numbers = [...this.numbers, this.currentNumber];
              this.currentNumber = '';
            }


            // if multiple operators are pressed
            if (this.numbers.length === this.operators.length) {
              this.operators[this.operators.length - 1] = value;
            }
            else {
              this.operators = [...this.operators, value];
            }

            console.log(this.numbers, this.operators);
            break;
        }
      });

  
  }


}

/*TODO: 
1. Reduce display text font when length is long
2. Disable decimal point when its already a decimal number
*/
