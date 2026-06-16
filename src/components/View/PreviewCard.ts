import { BaseCard } from './BaseCard';
import { categoryMap } from '../../utils/constants';
import { IEvents } from '../base/Events';

export interface IPreviewCard {
	image: string;
	title: string;
	description: string;
	category: string;
	price: number | null;
	buttonText: string;
	buttonEnabled: boolean;
}

/**
 * Компонент для отображения превью товара
 */
export class PreviewCard extends BaseCard {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	private _button: HTMLButtonElement;
	private _buttonText: string = 'Купить';
	private _buttonEnabled: boolean = true;
	private _id: string = '';

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._image = container.querySelector('.card__image')!;
		this._category = container.querySelector('.card__category')!;
		this._description = container.querySelector('.card__text')!;
		this._button = container.querySelector('.card__button')!;
		
		// Устанавливаем начальное состояние кнопки
		this._button.textContent = this._buttonText;
		this._button.disabled = !this._buttonEnabled;
	}

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id;
	}

	set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.titleElement?.textContent || '');
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

	set description(value: string) {
		if (this._description) {
			this._description.textContent = value;
		}
	}

	set buttonText(value: string) {
		this._buttonText = value;
		if (this._button) {
			this._button.textContent = value;
		}
	}

	set buttonEnabled(value: boolean) {
		this._buttonEnabled = value;
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	/**
	 * Устанавливает обработчик клика по кнопке 
	 */
	setOnClick(handler: () => void) {
		if (this._button) {
			this._button.addEventListener('click', handler);
		}
	}

	/**
	 * Устанавливает состояние кнопки (купить/удалить) 
	 */
	setInBasketState(inBasket: boolean) {
		this.buttonText = inBasket ? 'Убрать из корзины' : 'В корзину';
	}
}