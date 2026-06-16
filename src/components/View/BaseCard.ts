import { View } from './View';  
import { IEvents } from '../base/Events';  

export interface IBaseCard {  
	title: string;  
	price: number | null;  
}  

/**  
 * Базовый класс для карточек товаров  
 */  
export class BaseCard extends View<IBaseCard> {  
	protected titleElement: HTMLElement;  
	protected priceElement?: HTMLElement;  

	constructor(container: HTMLElement, events: IEvents) {  
		super(container, events);  

		this.titleElement = container.querySelector('.card__title')!;  
		this.priceElement = container.querySelector('.card__price')!; 
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
	 * Устанавливает цену карточки  
	 */  
	set price(value: number | null) {  
		if (this.priceElement) {  
			if (value === null) {  
				this.priceElement.textContent = 'Недоступно';  
			} else {  
				this.priceElement.textContent = `${value} синапсов`;  
			}  
		}  
	}  
}