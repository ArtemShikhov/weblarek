import { View } from './View';
import { IEvents } from '../base/Events';

export class Header extends View<{ counter: number }> {
	protected _counter: HTMLElement;
	protected _basketButton: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._counter = container.querySelector('.header__basket-counter')!;
		this._basketButton = container.querySelector('.header__basket')!;

		// Add click handler to basket button
		this._basketButton.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		if (this._counter) {
			this._counter.textContent = String(value);
		}
	}
}