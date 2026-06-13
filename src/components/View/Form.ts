import { View } from './View';
import { IEvents } from '../base/Events';

/**
 * Базовый класс для форм
 */
export abstract class Form<T> extends View<T> {
	protected inputs: HTMLInputElement[];
	protected submitButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.inputs = Array.from(container.querySelectorAll('input'));
		this.submitButton = container.querySelector('button[type="submit"]')!;

		// Устанавливаем обработчики для всех инпутов
		this.inputs.forEach(input => {
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
		const input = this.container.querySelector(`[name="${String(field)}"]`) as HTMLInputElement;
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
		this.inputs.forEach(input => {
			const error = errors[input.name as keyof T];
			if (error) {
				input.classList.add('form__input_invalid');
				const errorElement = this.container.querySelector(`[data-error-for="${input.name}"]`);
				if (errorElement) {
					errorElement.textContent = error;
				}
			} else {
				input.classList.remove('form__input_invalid');
				const errorElement = this.container.querySelector(`[data-error-for="${input.name}"]`);
				if (errorElement) {
					errorElement.textContent = '';
				}
			}
		});
	}
}