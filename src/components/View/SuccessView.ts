import { View } from './View';
import { IEvents } from '../base/Events';

export class SuccessView extends View<{ total: number }> {
	private descriptionElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.descriptionElement = container.querySelector('.order-success__description')!;
	}

	set total(value: number) {
		if (this.descriptionElement) {
			this.descriptionElement.textContent = `Списано ${value} синапсов`;
		}
	}
}