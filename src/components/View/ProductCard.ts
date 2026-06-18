import { BaseCard } from './BaseCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class ProductCard extends BaseCard {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents, onSelect: () => void) {
		super(container, events);

		this._image = container.querySelector('.card__image')!;
		this._category = container.querySelector('.card__category')!;
		this._price = container.querySelector('.card__price')!;
		this._description = container.querySelector('.card__text')!;
		this._button = container.querySelector('.card__button')!;

		// Устанавливаем обработчик клика на всю карточку
		container.addEventListener('click', onSelect);
		
		// Также сохраняем ссылку на кнопку для установки состояния
		if (this._button) {
			// Предотвращаем двойное срабатывание при клике на кнопку
			this._button.addEventListener('click', (e) => {
				e.stopPropagation();
				onSelect();
			});
		}
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