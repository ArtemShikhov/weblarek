import { Form } from './Form'; 
import { IEvents } from '../base/Events'; 
import { IOrder, TPayment } from '../../types'; 

export class OrderForm extends Form<IOrder> { 
	private _paymentButtons: NodeListOf<HTMLElement>; 
	private _addressInput: HTMLInputElement | null; 

	constructor(container: HTMLElement, events: IEvents) { 
		super(container, events); 

		this._paymentButtons = container.querySelectorAll('.button_alt'); 
		this._addressInput = container.querySelector('[name="address"]') as HTMLInputElement; 

		// Add event listeners for payment buttons 
		this._paymentButtons.forEach(button => { 
			button.addEventListener('click', (evt) => { 
				const target = evt.currentTarget as HTMLElement; 
				const name = target.getAttribute('name'); 
				if(name) { 
					// Remove active class from all buttons 
					this._paymentButtons.forEach(btn => btn.classList.remove('button_alt-active')); 
					// Add active class to clicked button 
					target.classList.add('button_alt-active'); 
					this.events.emit('order:change', {  
						field: 'payment',  
						value: name  
					});  
				} 
			}); 
		}); 

		// Add event listener for address input 
		if (this._addressInput) { 
			this._addressInput.addEventListener('input', () => { 
				this.events.emit('order:change', { 
					field: 'address', 
					value: this._addressInput!.value 
				}); 
			}); 
		} 
		
		// Add event listener for form submission
		container.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('order:submit');
		});
	} 


	protected get formName(): string { 
		return 'order'; 
	} 

	set payment(value: TPayment) { 
		this._paymentButtons.forEach(button => { 
			const name = button.getAttribute('name'); 
			if(name === value) { 
				button.classList.add('button_alt-active'); 
			} else { 
				button.classList.remove('button_alt-active'); 
			} 
		}); 
	} 

	set address(value: string) { 
		if (this._addressInput) { 
			this._addressInput.value = value; 
		} 
	} 
}