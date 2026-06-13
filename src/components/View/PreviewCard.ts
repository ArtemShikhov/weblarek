import { View } from './View';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

/**
 * Карточка для предпросмотра товара (в модальном окне)
 */
export class PreviewCard extends View<IProduct> {
	protected _id: string;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	private button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._id = '';
		this._title = container.querySelector('.card__title')!;
		this._image = container.querySelector('.card__image')!;
		this._category = container.querySelector('.card__category')!;
		this._price = container.querySelector('.card__price')!;
		this._description = container.querySelector('.card__text')!;
		this.button = container.querySelector('.card__button')!;
	}

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id;
	}

	set title(value: string) {
		if (this._title) {
			this._title.textContent = value;
		}
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this._title?.textContent || '');
		}
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
				this.button.disabled = true;
				if (this.button) {
					this.button.textContent = 'Недоступно';
				}
			} else {
				this._price.textContent = `${value} син.`;
				if (this.button) {
					this.button.disabled = false;
					this.button.textContent = 'Купить';
				}
			}
		}
	}

	set description(value: string) {
		if (this._description) {
			this._description.textContent = value;
		}
	}

	/**
	 * Устанавливает состояние кнопки (купить/удалить)
	 */
	setInBasketState(inBasket: boolean) {
		if (this.button) {
			if (inBasket) {
				this.button.textContent = 'Удалить из корзины';
			} else {
				this.button.textContent = 'Купить';
			}
		}
	}

	/**
	 * Блокирует кнопку, если цена недоступна
	 */
	setDisabledState(disabled: boolean) {
		if (this.button) {
			this.button.disabled = disabled;
		}
	}

	/**
	 * Устанавливает обработчик клика по кнопке
	 */
	setOnClick(handler: () => void) {
		if (this.button) {
			this.button.addEventListener('click', handler);
		}
	}
}