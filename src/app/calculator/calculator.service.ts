import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
      op = {
      currentValue: '.',
      accValue: '23',
      stripLeadingZero: function() {return this.accValue.replace(/^0+/, '')},
      concatenateValue: function(acc, curr) {return acc = (curr === '.' && operand.includes('.')) ? acc : acc = curr }
    };

  multiplication = '×';
  division = '÷';
  addition = '+';
  subtraction = '-';

  numberContent = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
  operatorContent = [this.division, this.multiplication, this.subtraction, this.addition]

  currentNumber = '0';
  operators = [];
  numbers = [];
  result = 0;
  userInput = [];
  previousNumber = '0';

  constructor() { }

  evaluateResult() {
    if (this.currentNumber) {
      this.numbers = [...this.numbers, this.currentNumber];
              
      this.userInput = this.result ? [this.result] : [...this.userInput, this.numbers[this.numbers.length-1]];
    }

    console.log('Evaluate', this.numbers, this.operators);
    // If user entered operator then clicked equals,the operator is not needed in the equation, so ignore it. 
    if (this.numbers.length === this.operators.length) {
      this.operators.pop();
      this.userInput.pop();
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
        newNumbers = [...newNumbers, operand1];
        operand1 = null;
        newOperators = [...newOperators, this.operators[i]]; 
      } 

      if (i === this.operators.length - 1) {
        let value = operand1 ? operand1 : this.numbers[i+1];
        newNumbers = [...newNumbers, value];
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

  collateEquation(operand, operator) {
    if (this.currentNumber) {
      this.addOperandToArray();
    }

    // if multiple operators are pressed
    if (this.numbers.length === this.operators.length) {
      this.operators[this.operators.length - 1] = operator;
      this.userInput[this.userInput.length - 1] = operator;
    }
    else {
      this.operators = [...this.operators, operator];
       this.userInput = [...this.userInput, this.operators[this.operators.length-1]];
    }
    return {
      currentOperand: '',
      displayValue: '',
      fullEquation: ''
    }
  }

  addOperandToArray() {
      this.numbers = [...this.numbers, this.currentNumber];
      this.userInput = [...this.userInput, this.currentNumber];

      // reset currentNumber
      this.previousNumber = this.currentNumber;
      this.currentNumber = '';
  }

  stripLeadingZero(operand) {
    return operand.replace(/^0+/, '');
  }
  
  hasDecimal(operand, curr) {
    return (curr === '.' && operand.includes('.'));
  }

  collateOperandString(operand:string, curr:string) {
    // this.currentNumber = this.currentNumber.replace(/^0+/, '');

    // this.currentNumber = (curr === '.' && this.currentNumber.includes('.')) ? this.currentNumber : this.currentNumber + curr; 

    operand = this.stripLeadingZero(operand);

    return this.hasDecimal(operand, curr) ? operand : operand + curr; 
  }

  togglePositiveNegative(operand) {
    return (+operand * -1).toString();
  }

  getPercentage(operand) {
    console.log('%', operand, +this.currentNumber / 100)
    return (+operand / 100).toString();
  }

  reset() {
    this.currentNumber = '0';
    this.numbers = [];
    this.operators = [];
    this.userInput = [];
    this.result = 0;
  }


}

/*
Services are just classes. 
Instances are provided to injectors
Injectors deliver them when needed.


We can share data between components using service, 
e.g mostPopularBook. 
*/