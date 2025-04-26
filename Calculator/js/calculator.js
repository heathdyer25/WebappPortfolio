/** Author: Heath Dyer 
 *  Calculator class maintains state of calcualtor
 * and performs actions based on given input
*/
export class Calculator {

    /** Constrcutor for caclulator. Sets initial state */
    constructor(display, history) {
        /** HTML elements to append */
        this.display = display;
        this.history = history;
        this.clear();
    };

    /** Prevents changing state from error except with clear */
    setState(state) {
        if (this.state == "error") {
            return;
        }
        this.state = state;
    }

    /** Updates the calculators display */
    updateDisplay(content) {
        /** Prevents display from being updated if in error state */
        if (this.state == 'error') {
            this.display.firstElementChild.innerText = 'Error';
            return;
        }
        content == '' ? this.display.firstElementChild.innerText = '0' : this.display.firstElementChild.innerText = content;
    };

    /** Add new item to history */
    addHistory(content) {
        const newItem = this.history.appendChild(document.createElement("li"));
        newItem.setAttribute('data-type', 'history');
        newItem.setAttribute('data-value', content);
        newItem.innerHTML = content;
        newItem.addEventListener('click', () => {
            this.transition(newItem.dataset.type, newItem.dataset.value);
        });
    };

    /** Reset history */
    clearHistory() {
        this.history.innerHTML = '';
    }

    /** Sets or resets initial state */
    clear() {
        this.state = 'start';
        this.operator = '';
        this.operandX = '';
        this.operandY = '';
        this.updateDisplay(this.operandX);
    }

    /** Error state for calculator */
    error() {
        this.state = 'error';
        this.display.firstElementChild.innerText = "Error";
    };

    /** Appends operand X */
    appendOperandX(input) {
        this.operandX += input;
        this.updateDisplay(this.operandX);
    }

    /** Appends operand Y */
    appendOperandY(input) {
        this.operandY += input;
        this.updateDisplay(this.operandY);
    }

    /** Performs calculator computation */
    compute() {
        let result = NaN;
        switch (this.operation) {
            case '+':
                result = parseFloat(this.operandX) + parseFloat(this.operandY);
                break;
            case '-':
                result = parseFloat(this.operandX) - parseFloat(this.operandY);
                break;
            case 'X':
                result = parseFloat(this.operandX) * parseFloat(this.operandY);
                break;
            case '/':
                result = parseFloat(this.operandX) / parseFloat(this.operandY);
                break;
            default:
                console.log("Error: operation not set for computation.");
                this.error();
                return;
        }
        if (isNaN(result) || result == Infinity) {
            console.log("Error: computation resulted in invalid result.")
            this.error();
            return;
        }
        this.operandX = '';
        this.operandY = '';
        this.operation = '';
        this.addHistory(result);
        return result;
    }

    /** Operation state for calculator */
    updateOperation(input) {
        this.operation = input;
    }

    /** Operation state for calculator */
    transitions = {
        /** Start at operatorX prefix */
        start: {
            //digit
            'number': (input) => {
                this.appendOperandX(input);
                this.setState('operandXAccumulator');
            },
            //operators
            'operation': (input) => { 
                if (this.operandX == '') {
                    this.appendOperandX('0');
                }
                this.updateOperation(input);
                this.setState("operation");
            },
            //special decimal case, still move states
            'decimal': (input) => {
                this.appendOperandX(input);
                this.setState('mantissaXAccumulator');
            },
            //clear state
            'clear': () => {
                this.clear();
            },
            /** appends operand with item from history */
            'history': (input) => {
                this.appendOperandX(input);
                this.setState('operandXAccumulator');
            },
            // clear history
            'clear-history': () => {
                this.clearHistory()
            },
        },
        /** Accumulate operand state */
        operandXAccumulator: {
            //append integers
            'number': (input) => {
                this.appendOperandX(input);
                this.setState('operandXAccumulator');
            },
            //move to operation state
            'operation': (input) => { 
                this.updateOperation(input);
                this.setState("operation");
            },
            //special decimal case
            'decimal': (input) => {
                this.appendOperandX(input);
                this.setState('mantissaXAccumulator');
            },
            //clear state
            'clear': () => {
                this.clear();
            },
            // clear history
            'clear-history': () => {
                this.clearHistory()
            },
        },
        /** Accumulate mantissa X state */
        mantissaXAccumulator: {
            'number': (input) => {
                this.appendOperandX(input);
                this.setState('mantissaXAccumulator');
            },
            //move to operation state
            'operation': (input) => { 
                this.updateOperation(input);
                this.setState("operation");
            },
            //clear state
            'clear': () => {
                this.clear();
            },
            // clear history
            'clear-history': () => {
                this.clearHistory()
            },
        },
        /** Operation selected, also startY state */
        operation: {
            //leading zeros
            'number': (input) => {
                this.appendOperandY(input);
                this.setState('operandYAccumulator');
            },
            //operators
            'operation': (input) => { 
                this.updateOperation(input);
                this.setState("operation");
            },
            //special decimal case, still move states
            'decimal': (input) => {
                this.appendOperandY(input);
                this.setState('mantissaYAccumulator');
            },
            /** appends operand with item from history */
            'history': (input) => {
                this.appendOperandY(input);
                this.setState('operandYAccumulator');
            },
            //clear state
            'clear': () => {
                this.clear();
            },
            // clear history
            'clear-history': () => {
                this.clearHistory()
            },
        },
        /** Accumulate second operand */
        operandYAccumulator: {
            //append integers
            'number': (input) => {
                this.appendOperandY(input);
                this.setState('operandYAccumulator');
            },
            //Operations here actually do computations
            'operation': (input) => { 
                let result = this.compute();
                if (result != undefined) {
                    this.appendOperandX(result);
                }
                this.updateOperation(input);
                this.setState("operation");
            },
            //special decimal case
            'decimal': (input) => {
                this.appendOperandY(input);
                this.setState('mantissaYAccumulator');
            },
            //equals button
            'computation': () => {
                let result = this.compute();
                if (result != undefined) {
                    this.appendOperandX(result);
                }
                this.setState("computation"); 
            },
            //clear state
            'clear': () => {
                this.clear();
            },
            // clear history
            'clear-history': () => {
                this.clearHistory()
            },
        },
        /** Accumulate mantissa of second operand */
        mantissaYAccumulator: {
            'number': (input) => {
                this.appendOperandY(input);
                this.setState('mantissaYAccumulator');
            },
            //Operations here actually do computations
            'operation': (input) => { 
                let result = this.compute();
                if (result != undefined) {
                    this.appendOperandX(result);
                }
                this.updateOperation(input);
                this.setState("computation");
            },
            //equals button
            'computation': () => {
                let result = this.compute();
                if (result != undefined) {
                    this.appendOperandX(result);
                }
                this.setState("computation");
            },
            //clear state
            'clear': () => {
                this.clear();
            },
            // clear history
            'clear-history': () => {
                this.clearHistory();
            },
        },
        /** Computation made */
        computation: {
            //leading zeros
            'number': (input) => {
                this.operandX = '';
                this.appendOperandX(input);
                this.setState('operandXAccumulator');
            },
            //operators
            'operation': (input) => { 
                this.updateOperation(input);
                this.setState("operation");
            },
            //special decimal case, still move states
            'decimal': (input) => {
                this.appendOperandY(input);
                this.setState('mantissaYAccumulator');
            },
            /** appends operand with item from history */
            'history': (input) => {
                this.operandX = '';
                this.appendOperandX(input);
                this.setState('operandXAccumulator');
            },
            //clear state
            'clear': () => {
                this.clear();
            },
            // clear history
            'clear-history': () => {
                this.clearHistory()
            },
        },
        /** Error state, must clear to get out */
        error: {
            //clear state
            'clear': () => {
                this.clear();
            },
            // clear history
            'clear-history': () => {
                this.clearHistory();
            },
        },
    };

    /** Transitions state of calculator based on input */
    transition(type, value) {
        /** If valid transition, perform function */
        if (this.transitions[this.state][type]) {
            this.transitions[this.state][type](value);
        }
    };

}
