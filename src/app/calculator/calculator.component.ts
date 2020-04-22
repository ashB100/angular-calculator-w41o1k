import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { Subject, fromEvent, Observable } from "rxjs";
import { map, reduce, scan } from "rxjs/operators";

@Component({
  selector: "app-calculator",
  templateUrl: "./calculator.component.html",
  styleUrls: ["./calculator.component.css"]
})
export class CalculatorComponent implements OnInit {
  @ViewChild("container") containerRef;
  @ViewChild('operand') operandRef;
  @ViewChild('operator') operatorRef;
  input$: Observable<string>;
  operator$: Observable<string>;
  operand$: Observable<string>;

  multiply = '×';
  divide = '÷';
  add = '+';
  subtract = '-';

  currentNumber = '0';
  operators = [];
  numbers = [];
  result = 0;
  userInput = [];
  previousNumber = '0';
  lookup = {
    'AC': () => this.reset(),
    '0': (value) => this.collateOperandString(value),
    '1': (value) => this.collateOperandString(value),
    '2': (value) => this.collateOperandString(value),
    '3': (value) => this.collateOperandString(value),
    '4': (value) => this.collateOperandString(value),
    '5': (value) => this.collateOperandString(value),
    '6': (value) => this.collateOperandString(value),
    '7': (value) => this.collateOperandString(value),
    '8': (value) => this.collateOperandString(value),
    '9': (value) => this.collateOperandString(value),
    'operator': (value) => this.addOperatorToArray(value),
    '.': () => this.concatenateDecimalPoint(),
    '+/-': () => this.togglePositiveNegative(),
    '%': () => this.getPercentage(),
    '=': () => this.evaluateResult()
  };

  // currentNumber;
  // operators;
  // numbers;
  // result;
  // userInput;
  // previousNumber;
  // lookup;

  evaluateResult() {
    console.log('Evaluate Results');
    if (this.currentNumber) {
      this.numbers = [...this.numbers, this.currentNumber];
              
      this.userInput = this.result ? [this.result] : [...this.userInput, this.numbers[this.numbers.length-1]];
    }

    console.log('Evaluate', this.numbers, this.operators);
    // If user entered operator then clicked equals,the operator is not needed in the equation, so ignore it. 
    if (this.numbers.length === this.operators.length) {
      this.operators.pop();
    } 
            
    let newNumbers = [];
    let newOperators = [];
    let operand1;

    // Pass 1: Multiplication and division
    for (let i = 0; i < this.operators.length; i++) {
      operand1 = operand1 ? operand1 : this.numbers[i];

      if (this.operators[i] === this.divide) {
        operand1 = +operand1 / +this.numbers[i+1];
      }
              
      if (this.operators[i] === this.multiply) {
        operand1 = +operand1 * +this.numbers[i+1];
      }

      if (this.operators[i] === '+' || this.operators[i] === '-') {
        newNumbers.push(operand1);
        operand1 = null;
        newOperators.push(this.operators[i]); 
      } 

      if (i === this.operators.length - 1) {
        let value = operand1 ? operand1 : this.numbers[i+1];
        newNumbers.push(value);
      }
    }

    // If there are only multiplications and/or divisions then  operand1 has the result:
    this.result = operand1 ? operand1 : this.currentNumber;

    console.log('newNumbers/newOperators', newNumbers, newOperators);

    // Pass 2: Add and subtract 
    if (newNumbers.length) {
      this.result = +newNumbers[0];
      for (let i = 0; i < newOperators.length; i++) {
        switch (newOperators[i]) {
          case '+':
            this.result += +newNumbers[i+1];
            break;
          case '-':
            this.result -= +newNumbers[i+1];
            break;
        }
      }
    }

    // Use the result in the next operation
    this.currentNumber = this.result.toString();
    this.numbers = [];
    this.operators = [];
  }


  addOperatorToArray(value) {
    if (this.currentNumber) {
      this.addOperandToArray();
    }

    // if multiple operators are pressed
    if (this.numbers.length === this.operators.length) {
      this.operators[this.operators.length - 1] = value;
    }
    else {
      this.operators = [...this.operators, value];
    }

    this.userInput = [...this.userInput, this.operators[this.operators.length-1]];
  }

  addOperandToArray() {
      this.numbers = [...this.numbers, this.currentNumber];
      this.userInput = [...this.userInput, this.currentNumber];

      // reset currentNumber
      this.previousNumber = this.currentNumber;
      this.currentNumber = '';
  }
  
  collateOperandString(value) {
    this.currentNumber = this.currentNumber + value;
    this.currentNumber = this.currentNumber.replace(/^0+/, '');
  }

  concatenateDecimalPoint() {
    if (!this.currentNumber.includes('.')) {
      this.currentNumber = this.currentNumber + '.';
    }
  }

  togglePositiveNegative() {
    this.currentNumber = (+this.currentNumber * -1).toString();
  }

  getPercentage() {
    this.currentNumber = (+this.currentNumber / 100).toString();
  }

  sum() {

  }

  times() {

  }

  reset() {
    this.currentNumber = '0';
    this.numbers = [];
    this.operators = [];
    this.userInput = [];
    this.result = 0;
  }

  constructor() {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.operator$ = fromEvent(this.operatorRef.nativeElement, 'click')
      .pipe(
        // map(event => event.target.textContent)
      )
      .subscribe(event => {
        this.lookup.operator(event.target.textContent);
        event.preventDefault();
        event.stopPropagation();
      });

    // this.operand$ = fromEvent(this.operandRef.nativeElement, 'click')
    //   .pipe(
        
    //   )
    //   .subscribe(event => {
    //     event.stopPropagation();
    //     event.preventDefault();
    //     this.lookup.operand(event.target.textContent);
    //   })

    this.input$ = fromEvent(this.containerRef.nativeElement, 'click')
      .pipe(
        map(event => event.target.textContent)
      )
      .subscribe(value => {
        this.lookup[value](value);
      })
    // this.input$ = fromEvent(this.containerRef.nativeElement, 'click')
    //   .pipe(
    //     map(event => event.target.textContent)
    //   )
    //   .subscribe(value => {
    //     switch (value) {
    //       case 'AC':
    //         this.currentNumber = '0';
    //         this.numbers = [];
    //         this.operators = [];
    //         this.userInput = [];
    //         this.result = 0;
    //         break;
    //       case '1':
    //       case '2':
    //       case '3': 
    //       case '4': 
    //       case '5':
    //       case '6': 
    //       case '7': 
    //       case '8':
    //       case '9':
    //       case '0':
    //         this.currentNumber = this.currentNumber + value;
    //         this.currentNumber = this.currentNumber.replace(/^0+/, '');
    //         break; 

    //       case '.': 
    //         if (!this.currentNumber.includes('.')) {
    //           this.currentNumber = this.currentNumber + value;
    //         }
    //         break;

    //       case '+/-':
    //         this.currentNumber = (+this.currentNumber * -1).toString();
    //         break;
          
    //       case '%':
    //         this.currentNumber = (+this.currentNumber / 100).toString();
    //         break;

    //       case this.add:
    //       case this.subtract:
    //       case this.multiply:
    //       case this.divide:

    //         if (this.currentNumber) {
    //           // strip leading zeros
    //           this.numbers = [...this.numbers, this.currentNumber];

    //           this.userInput = [...this.userInput, this.currentNumber];

    //           // reset currentNumber
    //           this.previousNumber = this.currentNumber;
    //           this.currentNumber = '';
    //         }

    //         // if multiple operators are pressed
    //         if (this.numbers.length === this.operators.length) {
    //           this.operators[this.operators.length - 1] = value;
    //         }
    //         else {
    //           this.operators = [...this.operators, value];
    //         }

    //         this.userInput = [...this.userInput, this.operators[this.operators.length-1]];
    //         break;

    //       case '=':
    //         if (this.currentNumber) {
    //           this.numbers = [...this.numbers, this.currentNumber];
              
    //           this.userInput = this.result ? [this.result] : [...this.userInput, this.numbers[this.numbers.length-1]];
    //         }

    //         // If user entered operator then clicked equals,
    //         // the operator is not needed in the equation, so ignore it. 
    //         if (this.numbers.length === this.operators.length) {
    //           this.operators.pop();
    //         } 
            
    //         let newNumbers = [];
    //         let newOperators = [];
    //         let operand1;

    //         // Pass 1: Multiplication and division
    //         for (let i = 0; i < this.operators.length; i++) {
    //           operand1 = operand1 ? operand1 : this.numbers[i];

    //           if (this.operators[i] === this.divide) {
    //             operand1 = +operand1 / +this.numbers[i+1];
    //           }
              
    //           if (this.operators[i] === this.multiply) {
    //             operand1 = +operand1 * +this.numbers[i+1];
    //           }

    //           if (this.operators[i] === '+' || this.operators[i] === '-') {
    //             newNumbers.push(operand1);
    //             operand1 = null;
    //             newOperators.push(this.operators[i]); 
    //           } 

    //           if (i === this.operators.length - 1) {
    //             let value = operand1 ? operand1 : this.numbers[i+1];
    //             newNumbers.push(value);
    //           }
    //         }

    //         // If there are only multiplications and/or divisions then  operand1 has the result:
    //         this.result = operand1 ? operand1 : this.currentNumber;

    //         console.log('newNumbers/newOperators', newNumbers, newOperators);

    //         // Pass 2: Add and subtract 
    //         if (newNumbers.length) {
    //           this.result = +newNumbers[0];
    //           for (let i = 0; i < newOperators.length; i++) {
    //             switch (newOperators[i]) {
    //               case '+':
    //                 this.result += +newNumbers[i+1];
    //                 break;
    //               case '-':
    //                 this.result -= +newNumbers[i+1];
    //                 break;
    //             }
    //           }
    //         }

    //         // Use the result in the next operation
    //         this.currentNumber = this.result.toString();
    //         this.numbers = [];
    //         this.operators = [];
    //         break;
    //     }
    //   });

  
  }


}

/*TODO: 
      1. Reduce display text font when length is long
Done  2. Disable decimal point when its already a decimal number
*/
