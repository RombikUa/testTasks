'use strict';

/*
* Class calculates rest for goods
*/
class RestCalculator {

    constructor(form, output) {

        if(!(form instanceof HTMLFormElement)) {
            throw new TypeError('input value is not a form element');
        }

        this._form = form;
        this._output = output;

        this._init();
        this._initEvents();
    }

    // init calculator variables
    _init() {
        this._sum = this._form.querySelector('.sum');
        this._price = this._form.querySelector('.price');
        this._submitButton = this._form.querySelector('button');
    }

    // init calculator events
    _initEvents() {
        this._submitButton.addEventListener('click', this._calc.bind(this))
    }

    // calculate rest
    _calc() {
        const sum = +this._sum.value;
        const price = +this._price.value;

        const rest = (sum - price).toFixed(2);
        const dollarsOutput = parseInt(rest) >= 2 ? `${parseInt(rest)} dollars` : parseInt(rest) === 1 ? `${parseInt(rest)} dollar` : '';
        const cents = parseInt(rest.split('.')[1]);
        const centsOutput = cents >= 2  ? `, ${cents} cents` : cents === 1 ? `, ${cents} cent`: '';

        if(rest >= 0) {
            this._output.textContent = `Your rest is ${dollarsOutput} ${centsOutput}`;
        } else {
            this._output.textContent = 'Wrong data!';
        }
    }
}

const form = document.querySelector('.js-form');
const output = document.querySelector('.js-result');

const calculator = new RestCalculator(form, output);
