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

  currentNumber = '0';
  operators = [];
  numbers = [];
  result = 0;
  userInput = [];
  previousNumber = '0';

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
            this.currentNumber = '0';
            this.numbers = [];
            this.operators = [];
            this.userInput = [];
            this.result = 0;
            break;
          case '1':
          case '2':
          case '3': 
          case '4': 
          case '5':
          case '6': 
          case '7': 
          case '8':
          case '9':
          case '0':
            this.currentNumber = this.currentNumber + value;
            this.currentNumber = this.currentNumber.replace(/^0+/, '');
            console.log('clicked', value);
            break; 

          case '.': 
            if (!this.currentNumber.includes('.')) {
              this.currentNumber = this.currentNumber + value;
            }
            break;

          case '+/-':
            this.currentNumber = (+this.currentNumber * -1).toString();
            break;
          
          case '%':
            this.currentNumber = (+this.currentNumber / 100).toString();
            break;

          case this.add:
          case this.subtract:
          case this.multiply:
          case this.divide:

            if (this.currentNumber) {
              // strip leading zeros
              this.numbers = [...this.numbers, this.currentNumber];

              this.userInput = [...this.userInput, this.currentNumber];

              // reset currentNumber
              this.previousNumber = this.currentNumber;
              this.currentNumber = '';
            }


            // if multiple operators are pressed
            if (this.numbers.length === this.operators.length) {
              this.operators[this.operators.length - 1] = value;
            }
            else {
              this.operators = [...this.operators, value];
            }

            this.userInput = [...this.userInput, this.operators[this.operators.length-1]];

            console.log(this.numbers, this.operators);
            break;

          case '=':
            if (this.currentNumber) {
              this.numbers = [...this.numbers, this.currentNumber];
            }
            if (this.numbers.length === this.operators.length) {
              this.operators.pop();
            } else {
              this.userInput = [...this.userInput, this.numbers[this.numbers.length-1]];
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

                if (i === this.operators.length - 1) {
                  newNumbers.push(this.numbers[i+1]);
                }
              } 
            }

            // If there are only multiplications and/or divisions then  operand1 has the result:
            this.result = operand1 ? operand1 : this.currentNumber;

            console.log('newNumbers/newOperators', newNumbers, newOperators)

            if (newNumbers.length) {
              // Pass 2: Add and subtract 
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

            console.log('result', this.result);
            // Use the result in the next operation
            this.currentNumber = this.result.toString();
            this.numbers = [];
            this.operators = [];
            this.userInput = [];
        }
      });

  
  }


}

/*TODO: 
      1. Reduce display text font when length is long
Done  2. Disable decimal point when its already a decimal number
*/
