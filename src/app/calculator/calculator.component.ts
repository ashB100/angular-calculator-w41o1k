import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { Subject, fromEvent, Observable, combineLatest } from "rxjs";
import { map, reduce, scan, withLatestFrom } from "rxjs/operators";

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

  multiplication = '×';
  division = '÷';
  addition = '+';
  subtraction = '-';

  currentNumber = '0';
  operators = [];
  numbers = [];
  result = 0;
  userInput = [];
  previousNumber = '0';

  lookup = {
    'AC': () => this.reset(),
    'operand': (value) => this.collateOperandString(value),
    'operator': (value) => this.addOperatorToArray(value),
    '+/-': () => this.togglePositiveNegative(),
    '%': () => this.getPercentage(),
    '=': () => this.evaluateResult()
  };

  evaluateResult() {
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

      if (this.operators[i] === this.division) {
        operand1 = +operand1 / +this.numbers[i+1];
      }
              
      if (this.operators[i] === this.multiplication) {
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
          case this.addition:
            this.result += +newNumbers[i+1];
            break;
          case this.subtraction:
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
    this.currentNumber = this.currentNumber.replace(/^0+/, '');

    this.currentNumber = (value === '.' && this.currentNumber.includes('.')) ? this.currentNumber : this.currentNumber + value; 
  }

  togglePositiveNegative() {
    this.currentNumber = (+this.currentNumber * -1).toString();
  }

  getPercentage() {
    this.currentNumber = (+this.currentNumber / 100).toString();
  }

  reset() {
    this.currentNumber = '0';
    this.numbers = [];
    this.operators = [];
    this.userInput = [];
    this.result = 0;
  }

  constructor() {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    fromEvent(this.containerRef.nativeElement, 'click')
      .pipe(
        map(event => event.target.textContent)
      )
      .subscribe(value => {
        this.lookup[value](value);
      })

    fromEvent(this.operandRef.nativeElement, 'click')
      .pipe(
        map(event => {
          event.preventDefault();
          event.stopPropagation();
          return event.target.textContent;
        })
      )
      .subscribe(value => this.lookup.operand(value));

    fromEvent(this.operatorRef.nativeElement, 'click')
      .pipe(
        map(event => {
          event.preventDefault();
          event.stopPropagation();
          return event.target.textContent;
        })
      )
      .subscribe(value => {
        this.lookup.operator(value);
      });

    // this.operand$ = fromEvent(this.operandRef.nativeElement, 'click')
    //   .pipe(
    //     map(event => {
    //       // event.stopPropagation();
    //       // event.preventDefault();
    //       return event.target.textContent;
    //     }),
    //     scan( (acc, curr) => {
    //       acc = acc.replace(/^0+/, '');
    //       acc = (curr === '.' && acc.includes('.')) ? acc : acc + curr;
    //       console.log('operand$', acc);
    //       return acc;
    //     }, '')
    //   );


    // this.clear$ = fromEvent(this.clearRef.nativeElement, 'click')
    //   .pipe(
    //     map(event => '0')
    //   );
    
    // this.toggleNegative$ = fromEvent(this.toggleNegativeRef.nativeElement, 'click')
    //   .pipe(
    //     withLatestFrom(this.operand$),
    //     map((event, operand) => {
    //       console.log('Toggle Negative', operand);
    //       return (+operand * -1).toString()
    //     })
    //   )
    //   .subscribe(value => console.log('Toggle Negative', value));

    // this.toggleNegative$ = combineLatest(fromEvent(this.toggleNegativeRef.nativeElement, 'click'), this.operand$)
    //   .pipe(
    //     map((event, operand) => {
    //       console.log('Toggle Negative', operand);
    //       return (+operand * -1).toString();
    //     })
    //   ).subscribe(value => console.log('Toggle Negative', value));

    // this.percentage$ = fromEvent(this.percentageRef.nativeElement, 'click')
    //   .pipe(
    //     map(event => event.target.textContent)
    //   );


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
