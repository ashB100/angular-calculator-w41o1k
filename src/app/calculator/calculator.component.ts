import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { Subject, fromEvent, Observable, combineLatest } from "rxjs";
import { map, reduce, scan, withLatestFrom } from "rxjs/operators";
import { CalculatorService } from "./calculator.service";

@Component({
  selector: "app-calculator",
  templateUrl: "./calculator.component.html",
  styleUrls: ["./calculator.component.css"]
})
export class CalculatorComponent {
  multiplication = '×';
  division = '÷';
  addition = '+';
  subtraction = '-';

  numberContent = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];
  operatorContent = [this.division, this.multiplication, this.subtraction, this.addition]

  currentOperand = '0';
  result = 0;
  equation = [];

  evaluateResult() {
    // if (this.currentOperand) {
    //   this.equation = this.result ? [this.result] : [...this.equation, this.currentOperand];
    // }

    let info = this.calculatorService.evaluateResult (this.currentOperand, this.equation, this.result);

    this.equation = info.equation;
    this.result = info.result;
    this.currentOperand = info.operand;
    // Use the result in the next operation
    // this.currentOperand = this.result.toString();
  }

  onOperatorInput(operator) {
    console.log('onOperator', operator);
    let info = this.calculatorService.collateEquation(this.currentOperand, operator, this.equation);

    console.log('info', info);
    this.currentOperand = info.operand;
    this.equation = info.equation;
    this.result = info.result;
  }

  onNumberInput(num) {
    this.currentOperand = this.calculatorService.collateOperandString(this.currentOperand, num);
  }

  onToggleNegative() {
    this.currentOperand = 
    this.calculatorService.togglePositiveNegative(this.currentOperand);
  } 

  onPercentageInput() {
    this.currentOperand = this.calculatorService.getPercentage(this.currentOperand);
  } 

  reset() {
    this.currentOperand = '0';
    this.equation = [];
    this.result = 0;
    this.calculatorService.reset();
  };

  constructor(private calculatorService: CalculatorService) {}

  ngOnInit() {

  }
}

/*TODO:
1. Strip 0 only if not followed by decimal point
*/


// evaluateResult() {
  //   if (this.currentNumber) {
  //     this.numbers = [...this.numbers, this.currentNumber];
              
  //     this.userInput = this.result ? [this.result] : [...this.userInput, this.numbers[this.numbers.length-1]];
  //   }

  //   console.log('Evaluate', this.numbers, this.operators);
  //   // If user entered operator then clicked equals,the operator is not needed in the equation, so ignore it. 
  //   if (this.numbers.length === this.operators.length) {
  //     this.operators.pop();
  //     this.userInput.pop();
  //   } 
            
  //   let newNumbers = [];
  //   let newOperators = [];
  //   let operand1;

  //   // Pass 1: Multiplication and division
  //   for (let i = 0; i < this.operators.length; i++) {
  //     operand1 = operand1 ? operand1 : this.numbers[i];

  //     if (this.operators[i] === this.division) {
  //       operand1 = +operand1 / +this.numbers[i+1];
  //     }
              
  //     if (this.operators[i] === this.multiplication) {
  //       operand1 = +operand1 * +this.numbers[i+1];
  //     }

  //     if (this.operators[i] === '+' || this.operators[i] === '-') {
  //       newNumbers = [...newNumbers, operand1];
  //       operand1 = null;
  //       newOperators = [...newOperators, this.operators[i]]; 
  //     } 

  //     if (i === this.operators.length - 1) {
  //       let value = operand1 ? operand1 : this.numbers[i+1];
  //       newNumbers = [...newNumbers, value];
  //     }
  //   }

  //   // If there are only multiplications and/or divisions then  operand1 has the result:
  //   this.result = operand1 ? operand1 : this.currentNumber;

  //   console.log('newNumbers/newOperators', newNumbers, newOperators);

  //   // Pass 2: Add and subtract 
  //   if (newNumbers.length) {
  //     this.result = +newNumbers[0];
  //     for (let i = 0; i < newOperators.length; i++) {
  //       switch (newOperators[i]) {
  //         case this.addition:
  //           this.result += +newNumbers[i+1];
  //           break;
  //         case this.subtraction:
  //           this.result -= +newNumbers[i+1];
  //           break;
  //       }
  //     }
  //   }

  //   // Use the result in the next operation
  //   this.currentNumber = this.result.toString();
  //   this.numbers = [];
  //   this.operators = [];
  // }

  // collateEquation(value) {
  //   if (this.currentNumber) {
  //     this.addOperandToArray();
  //   }

  //   // if multiple operators are pressed
  //   if (this.numbers.length === this.operators.length) {
  //     this.operators[this.operators.length - 1] = value;
  //     this.userInput[this.userInput.length - 1] = value;
  //   }
  //   else {
  //     this.operators = [...this.operators, value];
  //      this.userInput = [...this.userInput, this.operators[this.operators.length-1]];
  //   }
  // }

  // addOperandToArray() {
  //     this.numbers = [...this.numbers, this.currentNumber];
  //     this.userInput = [...this.userInput, this.currentNumber];

  //     // reset currentNumber
  //     this.previousNumber = this.currentNumber;
  //     this.currentNumber = '';
  // }
  
  // collateOperandString(value) {
  //   this.currentNumber = this.currentNumber.replace(/^0+/, '');

  //   this.currentNumber = (value === '.' && this.currentNumber.includes('.')) ? this.currentNumber : this.currentNumber + value; 
  // }

  // togglePositiveNegative() {
  //   this.currentNumber = (+this.currentNumber * -1).toString();
  // }

  // getPercentage() {
  //   this.currentNumber = (+this.currentNumber / 100).toString();
  // }

  // reset() {
  //   this.currentNumber = '0';
  //   this.numbers = [];
  //   this.operators = [];
  //   this.userInput = [];
  //   this.result = 0;
  // }