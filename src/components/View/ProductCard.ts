import { View } from './View';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class ProductCard extends View<IProduct> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._title = container.querySelector('.card__title')!;
		this._image = container.querySelector('.card__image')!;
		this._category = container.querySelector('.card__category')!;
		this._price = container.querySelector('.card__price')!;
		this._description = container.querySelector('.card__text')!;
		this._button = container.querySelector('.card__button')!;

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('product:select', { id: this.id });
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

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		if (this._category) {
			this._category.textContent = value;
			// Apply category modifier class
			const modifierClass = categoryMap[value as keyof typeof categoryMap];
			if (modifierClass) {
				this._category.className = `card__category ${modifierClass}`;
			} else {
				this._category.className = 'card__category';
			}
		}
	}

	set price(value: number | null) {
		if (this._price) {
			if (value === null) {
				this._price.textContent = 'Недоступно';
				if (this._button) {
					this._button.disabled = true;
					this._button.textContent = 'Недоступно';
				}
			} else {
				this._price.textContent = `${value} син.`;
				if (this._button) {
					this._button.disabled = false;
					this._button.textContent = 'Купить';
				}
			}
		}
	}

	set description(value: string) {
		if (this._description) {
			this._description.textContent = value;
		}
	}
}