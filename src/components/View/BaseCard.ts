import { View } from './View';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export interface IBaseCard {
	id: string;
	title: string;
	description?: string;
	image?: string;
	category: string;
	price: number | null;
}

/**
 * Базовый класс для карточек товаров
 */
export class BaseCard extends View<IBaseCard> {
	protected _id: string;
	protected titleElement: HTMLElement;
	protected imageElement?: HTMLImageElement;
	protected categoryElement?: HTMLElement;
	protected priceElement?: HTMLElement;
	protected descriptionElement?: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._id = '';
		this.titleElement = container.querySelector('.card__title')!;
		this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
		this.categoryElement = container.querySelector('.card__category')!;
		this.priceElement = container.querySelector('.card__price')!;
		this.descriptionElement = container.querySelector('.card__text')!;
	}

	/**
	 * Устанавливает ID карточки
	 */
	set id(value: string) {
		this._id = value;
	}

	/**
	 * Устанавливает заголовок карточки
	 */
	set title(value: string) {
		if (this.titleElement) {
			this.titleElement.textContent = value;
		}
	}

	/**
	 * Устанавливает изображение карточки
	 */
	set image(value: string) {
		if (this.imageElement) {
			this.setImage(this.imageElement, value, this.titleElement?.textContent || '');
		}
	}

	/**
	 * Устанавливает категорию карточки
	 */
	set category(value: string) {
		if (this.categoryElement) {
			this.categoryElement.textContent = value;
			
			// Удаляем все классы категории
			Object.values(categoryMap).forEach(className => {
				this.categoryElement!.classList.remove(className);
			});
			
			// Добавляем соответствующий класс
			const categoryKey = value as keyof typeof categoryMap;
			if (categoryMap[categoryKey]) {
				this.categoryElement!.classList.add(categoryMap[categoryKey]);
			}
		}
	}

	/**
	 * Устанавливает цену карточки
	 */
	set price(value: number | null) {
		if (this.priceElement) {
			if (value === null) {
				this.priceElement.textContent = 'Недоступно';
				this.container.classList.add('card_disabled');
			} else {
				this.priceElement.textContent = `${value} синапсов`;
			}
		}
	}

	/**
	 * Устанавливает описание карточки
	 */
	set description(value: string) {
		if (this.descriptionElement) {
			this.descriptionElement.textContent = value;
		}
	}
}