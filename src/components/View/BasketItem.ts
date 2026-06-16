import { BaseCard } from './BaseCard';  
import { IEvents } from '../base/Events';  
  
export class BasketItem extends BaseCard {  
	protected _index: HTMLElement;  
	protected _deleteButton: HTMLButtonElement;  
  
	constructor(container: HTMLElement, events: IEvents, onDelete: (id: string) => void) {  
		super(container, events);  
 
		this._index = container.querySelector('.basket__item-index')!;  
		this._deleteButton = container.querySelector('.basket__item-delete')!;  
 
		if (this._deleteButton) {  
			this._deleteButton.addEventListener('click', () => {  
				const id = container.dataset.id || '';  
				onDelete(id);  
			});  
		}  
	}  
  
	set id(value: string) {  
		this.container.dataset.id = value;  
	}  
  
	set index(value: number) {  
		if (this._index) {  
			this._index.textContent = String(value);  
		}  
	}  
}