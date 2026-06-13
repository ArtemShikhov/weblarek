import { View } from './View';
import { IEvents } from '../base/Events';

export class BasketView extends View<{ items: HTMLElement[], total: number }> {
	private basketList: HTMLElement;
	private totalElement: HTMLElement;
	private button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.basketList = container.querySelector('.basket__list')!;
		this.totalElement = container.querySelector('.basket__price')!;
		this.button = container.querySelector('.basket__button')!;

		this.button.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		if (this.basketList) {
			if (items.length > 0) {
				this.basketList.replaceChildren(...items);
			} else {
				this.basketList.innerHTML = '<p>Корзина пуста</p>';
			}
		}
	}

	set total(value: number) {
		if (this.totalElement) {
			this.totalElement.textContent = `${value} син.`;
		}
	}

	setOrderButtonState(enabled: boolean) {
		if (this.button) {
			this.button.disabled = !enabled;
		}
	}
}