/** Author: Heath Dyer 
 *  Calculator class maintains state of calcualtor
 * and performs actions based on given input
*/

import { Calculator } from './calculator.js';

/** Buttons for calculator */
const buttons = document.querySelectorAll(".btn");
const display = document.querySelector("#display");
const history = document.querySelector("#history-list");

/** Calculator object, handles state transitions */
const calculator = new Calculator(display, history);

/** Buttons call transition function */
buttons.forEach((button) => {
    button.firstElementChild.innerHTML = button.dataset.value;
    button.addEventListener('click', () => {
        calculator.transition(button.dataset.type, button.dataset.value);
    });
});
