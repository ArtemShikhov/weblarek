import { View } from './View';
import { IEvents } from '../base/Events';

export class Modal extends View<{ content: HTMLElement }> {
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._closeButton = container.querySelector('.modal__close')!;
		this._content = container.querySelector('.modal__content')!;

		this._closeButton.addEventListener('click', () => {
			this.events.emit('modal:close');
		});

		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.events.emit('modal:close');
			}
		});

		document.addEventListener('keydown', (evt) => {
			if (evt.key === 'Escape') {
				this.events.emit('modal:close');
			}
		});
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	toggleModal(state: boolean) {
		if (state) {
			this.container.classList.add('modal_active');
			document.body.classList.add('lock');
		} else {
			this.container.classList.remove('modal_active');
			document.body.classList.remove('lock');
		}
	}

	render(data: { content: HTMLElement }): HTMLElement {
		super.render(data);
		this.toggleModal(true);
		return this.container;
	}
}