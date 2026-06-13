import { View } from './View';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class BasketItem extends View<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._title = container.querySelector('.card__title')!;
		this._price = container.querySelector('.card__price')!;
		this._index = container.querySelector('.basket__item-index')!;
		this._deleteButton = container.querySelector('.basket__item-delete')!;

		if (this._deleteButton) {
			this._deleteButton.addEventListener('click', () => {
				this.events.emit('basket:remove', { id: this.id });
			});
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number | null) {
		if (this._price) {
			if (value === null) {
				this._price.textContent = 'Бесценно';
			} else {
				this._price.textContent = `${value} син.`;
			}
		}
	}

	set index(value: number) {
		if (this._index) {
			this._index.textContent = String(value);
		}
	}
}