import { IEvents } from '../components/base/Events';
import { IBuyer, BuyerErrors, TPayment } from '../types';

export class OrderModel {
	private _payment: TPayment = 'card';
	private _address: string = '';
	private _email: string = '';
	private _phone: string = '';
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setField(field: 'payment' | 'address' | 'email' | 'phone', value: string) {
		switch (field) {
			case 'payment':
				this._payment = value as TPayment;
				break;
			case 'address':
				this._address = value;
				break;
			case 'email':
				this._email = value;
				break;
			case 'phone':
				this._phone = value;
				break;
		}
		// Emit event for any field change
		this.events.emit('order:changed', { 
			order: this.getData(),
			field,
			value 
		});
	}

	validate(): BuyerErrors {
		const errors: Partial<Record<keyof IBuyer, string>> = {};

		if (!this._payment) {
			errors.payment = 'Не выбран способ оплаты';
		}

		if (!this._address) {
			errors.address = 'Не указан адрес';
		}

		if (!this._email) {
			errors.email = 'Не указан email';
		}

		if (!this._phone) {
			errors.phone = 'Не указан телефон';
		}

		return errors;
	}

	getData(): IBuyer {
		return {
			payment: this._payment,
			address: this._address,
			email: this._email,
			phone: this._phone
		};
	}

	clear() {
		this._payment = 'card';
		this._address = '';
		this._email = '';
		this._phone = '';
		this.events.emit('order:changed', { 
			order: this.getData()
		});
	}
}