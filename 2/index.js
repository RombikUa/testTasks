/*
* Modal window
*/
class Modal {

    constructor(title, content) {
        this._initTemplate(...arguments);
        this._initEvents();
    }

    // public methods

    // append a modal window to the document and show
    show() {
        document.body.prepend(this._modalContainer);

        setTimeout(() => {
            this._backdrop.classList.add('backdrop-showing');
            this._modal.classList.add('modal-showing');
        }, 0);
    }

    // hide a modal window and remove from document
    hide() {
        this._backdrop.classList.remove('backdrop-showing');
        this._modal.classList.remove('modal-showing');

        setTimeout(() => {
            this._modalContainer.remove();
        }, 400);
    }

    // private methods

    // init a modal window template
    _initTemplate(title = '', content = '') {
        this._modalContainer = document.createElement('div');
        this._modalContainer.className = 'modal-container';

        this._content = `<div class="backdrop"></div>
                        <div class="modal" tabindex="-1" aria-modal="true" role="dialog">
                            <div class="modal-header">
                                <h5>${title}</h5>
                            </div>
                            <div class="modal-body">
                                <p>${content}</p>
                                <button type="button">Close</button>
                            </div>
                        </div>`;
        this._modalContainer.innerHTML = this._content;

        this._modal = this._modalContainer.querySelector('.modal');
        this._backdrop = this._modalContainer.querySelector('.backdrop');
        this._closeButton = this._modalContainer.querySelector('button');
    }

    // initialization of events
    _initEvents() {
        this._backdrop.addEventListener('click', this.hide.bind(this));
        this._closeButton.addEventListener('click', this.hide.bind(this));
    }
}


const button = document.querySelector('.js-open-modal');

button.addEventListener('click', () => {
    const modal = new Modal('Modal Window', 'test content');

    modal.show();
});
