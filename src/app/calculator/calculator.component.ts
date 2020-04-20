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
  result = 0;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {

    this.input$ = fromEvent(this.container.nativeElement, 'click')
      .pipe(
        map(event => event.target.textContent)
      )
      .subscribe(value => {
        switch (value) {
          case 'AC':
            this.currentNumber = '';
            this.numbers = [];
            this.operators = [];
            this.result = null;
            break;
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

            if (this.currentNumber) {
              // strip leading zeros
              this.currentNumber = this.currentNumber.replace(/^0+/, '');

              this.numbers = [...this.numbers, this.currentNumber];

              // reset currentNumber
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

          case '=':
            if (this.currentNumber) {
              this.numbers = [...this.numbers, this.currentNumber];
            }
            if (this.numbers.length === this.operators.length) {
              this.operators.pop();
            }

            // let n = [...this.numbers];
            // let o = [...this.operators];

            // pass 1 for division and multiplicaiton
            // for (let i=0 ; i < o.length; i++) {
            //   if (o[i] === this.multiply) {
            //     let result = this.numbers[i] * this.numbers[i+1];

            //     let nextIndex = i + 2;

            //     if (nextIndex < n.length - 1)  {
            //       n = [...n.slice(0, i), result, ...this.numbers.slice(i+2)];
            //       console.log('multiply1: result/numbers', result, n);
            //     }
            //     else {
            //       n = [...n.slice(0, i), result];
            //       console.log('multiply2: result/numbers', result, n);
            //     }
            //   }
            //   if (o[i] === this.divide) {
            //     let result = this.numbers[i] / this.numbers[i+1];
            //     let nextIndex = i + 2;
            //     if (nextIndex < n.length - 1) {
            //       n = [...n.slice(0, i), result, ...this.numbers.slice(i+2)];
            //       console.log('divide1: result/numbers', result, n);
            //     }
            //     else {
            //       n = [...n.slice(0, i-1), result];
            //       console.log('divide2: result/numbers', result, n);
            //     }
            //   }
            // }
            let newNumbers = [];
            let newOperators = [];
            let operand1;
            let result = 0;
            for (let i = 0; i < this.operators.length; i++) {

              operand1 = operand1 ? operand1 : this.numbers[i];

              if (this.operators[i] === this.divide) {
                operand1 = operand1 / this.numbers[i+1];
              }
              
              if (this.operators[i] === this.multiply) {
                operand1 = operand1 * this.numbers[i+1];

              }

              if (this.operators[i] === '+' || this.operators[i] === '-') {
                newNumbers.push(operand1);
                operand1 = null;
                newOperators.push(this.operators[i]); 

                if (i === this.operators.length - 1) {
                  newNumbers.push(this.numbers[i+1]);
                }
              } 
            }
            console.log('newNumbers/newOperators', newNumbers, newOperators)

            // pass 2 for addition and subtraction
            this.result = +newNumbers[0];
            for (let i = 0; i < newOperators.length; i++) {
              switch (newOperators[i]) {
                case '+':
                  this.result += +newNumbers[i+1];
                  break;
                case '-':
                  this.result -= newNumbers[i+1];
                  break;
              }
            }
            console.log('result', this.result);
            // Use the result in the next operation
            this.currentNumber = this.result.toString();
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
