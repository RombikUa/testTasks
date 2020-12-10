/*
* Class provides static methods to work with date
*/
class Moment {

    // return current date
    static getDate() {
        const dateNow = new Date();

        return `${dateNow.getMonth() + 1}/${dateNow.getDate()}/${dateNow.getFullYear()}`;
    }
}

/*
* Class provides static methods to validate data
*/
class Validators {

    // email validator
    static email(email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return re.test(String(email).toLowerCase());
    }

    // required validator
    static required(value) {
        return value && !!value.trim();
    }
}

/*
* Class provides static methods to work with form
*/
class Form {

    // return Map with parsed data from a form
    static parseInputs(form) {
        let isValid = true;
        const parsed = new Map();

        if (!(form instanceof HTMLFormElement)) {
            throw new TypeError('input value is not a form element');
        }

        const inputs = form.querySelectorAll('input');

        inputs.forEach((input) => {
            const error = getError(input);

            parsed.set(input.name, {
                type: input.type,
                value: input.value,
                error
            });
        });

        return {data: parsed, isValid};

        // check input on errors
        // return error message or empty string
        function getError(input) {

            switch (input.type) {
                case 'email':
                    if(!Validators.email(input.value)) {
                        isValid = false;
                        return 'Email is invalid!';
                    } else {
                        return '';
                    }
                default:
                    if(!Validators.required(input.value)) {
                        isValid = false;
                        return 'This field is required!';
                    } else {
                        return '';
                    }
            }
        }
    }

    // reset all input values
    static reset(form) {
        if (!(form instanceof HTMLFormElement)) {
            throw new TypeError('input value is not a form element');
        }

        const inputs = form.querySelectorAll('input');

        inputs.forEach((input) => {
            input.value = '';
        });
    }
}

/*
* Class creates a table control that allow work with table rows
*/
class UserTable {

    constructor(table) {

        if(!(table instanceof HTMLTableElement)) {
            throw new TypeError('input value is not a table element');
        }

        this._table = table;

        this._init();
    }

    // add new row to the table
    // get Map object with row data
    addRow(data) {
        const lastIndex = this._lastIndex++;
        const row = document.createElement('tr');
        let innerContent = '';

        row.dataset.id = lastIndex;
        innerContent += `<td>${lastIndex + 1}</td>`;

        data.forEach((v) => {
            innerContent += `<td class="editable">${v.value}</td>`;
        });

        innerContent += `<td>${Moment.getDate()}</td>
                         <td>
                            <button type="button" data-action="edit">Edit</button>
                            <button type="button" data-action="remove">Delete</button>
                         </td>`;

        row.innerHTML = innerContent;

        this._tbody.append(row);
    }

    // init form control
    _init() {
        this._tbody = this._table.querySelector('tbody');

        this._updateIndexes();
        this._bindActions();
    }

    // update rows number / rows id
    _updateIndexes() {
        this._rows = this._tbody.querySelectorAll('tr');
        this._lastIndex = this._rows.length;

        this._rows.forEach((row, index) => {
            row.dataset.id = index;
            row.firstElementChild.innerText = index + 1;
        });
    }

    // delegate the capture of actions
    _bindActions() {
        this._table.addEventListener('click', (e) => {
            const actionButton = e.target.closest('[data-action]');

            if(!actionButton) return;

            this._doAction(actionButton, e.target.closest('tr'));
        });
    }

    // run an existing action
    _doAction(button, row) {
        let action;

        switch (button.dataset.action) {
            case 'edit':
                action = () => {
                    const fields = row.querySelectorAll('.editable');

                    fields.forEach((field) => {
                        const input = document.createElement('input');

                        input.value = field.innerText;
                        field.replaceChild(input, field.firstChild);
                    });

                    button.dataset.action = 'save';
                    button.innerText = 'Save';
                };
                break;
            case 'save':
                action = () => {
                    const inputs = row.querySelectorAll('input');

                    inputs.forEach((input) => {
                        input.replaceWith(input.value);
                    });

                    button.dataset.action = 'edit';
                    button.innerText = 'Edit';
                };
                break;
            case 'remove':
                action = () => {
                    row.remove();
                    this._updateIndexes();
                };
                break;
            default:
                return;
        }

        action();
    }
}

// Submit form
function submit(form) {
    const parsedForm = Form.parseInputs(form);

    parsedForm.data.forEach((v, k) => {
        form.querySelector(`input[name="${k}"]`).nextElementSibling.innerText = v.error;
    });

    if(!parsedForm.isValid) {
        form.classList.add('is-invalid');
        return;
    }

    form.classList.remove('is-invalid');
    tableControl.addRow(parsedForm.data);
    Form.reset(form);
}

const form = document.querySelector('.js-form');
const table = document.querySelector('.js-table');

const tableControl = new UserTable(table);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    submit(e.target);
});
