import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export class ContactsForm extends Form<IBuyer> {
	private _emailInput?: HTMLInputElement;
	private _phoneInput?: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._emailInput = container.querySelector('[name="email"]') as HTMLInputElement;
		this._phoneInput = container.querySelector('[name="phone"]') as HTMLInputElement;

		container.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit('contacts:submit');
		});

		// Add event listeners for inputs if they exist
		if (this._emailInput) {
			this._emailInput.addEventListener('input', () => {
				this.events.emit('form:change', {
					field: 'email',
					value: this._emailInput!.value
				});
			});
		}

		if (this._phoneInput) {
			this._phoneInput.addEventListener('input', () => {
				this.events.emit('form:change', {
					field: 'phone',
					value: this._phoneInput!.value
				});
			});
		}
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