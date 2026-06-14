import { View } from './View'; 
import { IEvents } from '../base/Events'; 
 
export class Modal extends View<{ content: HTMLElement }> { 
	private _closeButton: HTMLButtonElement; 
	private _content: HTMLElement; 
 
	constructor(container: HTMLElement, events: IEvents) { 
		super(container, events); 
 
		this._closeButton = container.querySelector('.modal__close')!; 
		this._content = container.querySelector('.modal__content')!; 
 
		this._closeButton.addEventListener('click', () => { 
			this.close(); 
		}); 
 
		this.container.addEventListener('mousedown', (evt) => { 
			if (evt.target === evt.currentTarget) { 
				this.close(); 
			} 
		}); 
 
		document.addEventListener('keydown', (evt) => { 
			if (evt.key === 'Escape') { 
				this.close(); 
			} 
		}); 
	} 
 
	set content(value: HTMLElement) { 
		this._content.replaceChildren(value); 
	} 

	open() {
		this.container.classList.add('modal_active'); 
		document.body.classList.add('lock'); 
	} 
	
	close() {
		this.container.classList.remove('modal_active'); 
		document.body.classList.remove('lock'); 
		this.events.emit('modal:close');
	} 

	render(data: { content: HTMLElement }): HTMLElement { 
		super.render(data); 
		this.open();
		return this.container; 
	} 
}