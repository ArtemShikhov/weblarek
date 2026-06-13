import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export class ContactsForm extends Form<IBuyer> {
	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._emailInput = container.querySelector('[name="email"]')!;
		this._phoneInput = container.querySelector('[name="phone"]')!;

		container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	protected get formName(): string {
		return 'contacts';
	}

	set email(value: string) {
		if (this._emailInput) {
			this._emailInput.value = value;
		}
	}

	set phone(value: string) {
		if (this._phoneInput) {
			this._phoneInput.value = value;
		}
	}
}