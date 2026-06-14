import { View } from './View'; 
import { IEvents } from '../base/Events'; 

interface IInputWithErrors {
	element: HTMLInputElement;
	errorElement: HTMLElement | null;
}

/** 
 * Базовый класс для форм 
 */ 
export abstract class Form<T> extends View<T> { 
	protected inputs: IInputWithErrors[]; 
	protected submitButton: HTMLButtonElement; 

	constructor(container: HTMLElement, events: IEvents) { 
		super(container, events); 

		const inputElements = Array.from(container.querySelectorAll('input')) as HTMLInputElement[];
		this.inputs = inputElements.map(input => ({
			element: input,
			errorElement: container.querySelector(`[data-error-for="${input.name}"]`) as HTMLElement
		}));
		
		this.submitButton = container.querySelector('button[type="submit"]')!; 

		// Устанавливаем обработчики для всех инпутов 
		this.inputs.forEach(inputObj => {
			const input = inputObj.element;
			input.addEventListener('input', (e) => { 
				const target = e.target as HTMLInputElement; 
				this.events.emit(`${this.formName}:change`, { 
					field: target.name, 
					value: target.value 
				}); 
			}); 
		}); 
	} 

	/** 
	 * Название формы для использования в событиях 
	 */ 
	protected abstract get formName(): string; 

	/** 
	 * Устанавливает значение поля формы 
	 */ 
	setFieldValue(field: keyof T, value: string): void { 
		const input = this.inputs.find(inputObj => inputObj.element.name === String(field))?.element;
		if (input) { 
			input.value = value; 
		} 
	} 

	/** 
	 * Устанавливает состояние кнопки отправки 
	 */ 
	setSubmitState(enabled: boolean): void { 
		if (this.submitButton) { 
			this.submitButton.disabled = !enabled; 
		} 
	} 

	/** 
	 * Устанавливает ошибки валидации 
	 */ 
	setErrors(errors: Partial<Record<keyof T, string>>): void { 
		this.inputs.forEach(inputObj => {
			const input = inputObj.element;
			const error = errors[input.name as keyof T];
			if (error) { 
				input.classList.add('form__input_invalid'); 
				if (inputObj.errorElement) { 
					inputObj.errorElement.textContent = error; 
				} 
			} else { 
				input.classList.remove('form__input_invalid'); 
				if (inputObj.errorElement) { 
					inputObj.errorElement.textContent = ''; 
				} 
			} 
		}); 
	} 
}