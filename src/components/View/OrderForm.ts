import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IOrder, TPayment } from '../../types';

export class OrderForm extends Form<IOrder> {
	private _paymentButtons: NodeListOf<HTMLInputElement>;
	private _addressInput: HTMLInputElement | null;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._paymentButtons = container.querySelectorAll('input[name="payment"]');
		this._addressInput = container.querySelector('#address');

		// Add event listeners for payment buttons
		this._paymentButtons.forEach(button => {
			button.addEventListener('change', (evt) => {
				const target = evt.target as HTMLInputElement;
				if (target.checked) {
					this.events.emit('order:payment:changed', { payment: target.value as TPayment });
				}
			});
		});

		// Add event listener for address input (guard against missing markup)
		if (this._addressInput) {
			this._addressInput.addEventListener('input', () => {
				this.events.emit(`${this.formName}:change`, {
					field: 'address',
					value: this._addressInput!.value
				});
			});
		}
	}


	protected get formName(): string {
		return 'order';
	}

	set payment(value: TPayment) {
		Array.from(this._paymentButtons).forEach(button => {
			button.checked = button.value === value;
			
			// Update button classes to reflect active state
			const buttonElement = button.closest('.button');
			if (buttonElement) {
				if (button.checked) {
					buttonElement.classList.add('button_alt-active');
				} else {
					buttonElement.classList.remove('button_alt-active');
				}
			}
		});
	}

	set address(value: string) {
		if (this._addressInput) {
			this._addressInput.value = value;
		}
	}
}