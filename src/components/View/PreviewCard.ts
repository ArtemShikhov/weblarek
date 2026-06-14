import { View } from './View';
import { BaseCard } from './BaseCard'; 
import { IEvents } from '../base/Events'; 
import { IProduct } from '../../types'; 
import { categoryMap } from '../../utils/constants'; 
 
/** 
 * Карточка для предпросмотра товара (в модальном окне) 
 */ 
export class PreviewCard extends BaseCard { 
	protected _image: HTMLImageElement; 
	protected _category: HTMLElement; 
	protected _description: HTMLElement; 
	private _button: HTMLButtonElement; 
	private _buttonText: string = 'Купить';
	private _buttonEnabled: boolean = true;
 
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