import { IEvents } from '../components/base/Events';
import { IProduct } from '../types';

export class BasketModel {
	private _items: IProduct[] = [];
	private _events: IEvents;

	constructor(events: IEvents) {
		this._events = events;
	}

	/**
	 * Добавляет товар в корзину
	 */
	add(product: IProduct) {
		if (!this.hasItem(product.id)) {
			this._items.push(product);
			this._events.emit('basket:changed', { 
				items: this._items, 
				total: this.getTotal(), 
				totalCount: this.getTotalCount() 
			});
		}
	}

	/**
	 * Удаляет товар из корзины
	 */
	remove(productId: string) {
		this._items = this._items.filter(item => item.id !== productId);
		this._events.emit('basket:changed', { 
			items: this._items, 
			total: this.getTotal(), 
			totalCount: this.getTotalCount() 
		});
	}

	/**
	 * Очищает корзину
	 */
	clear() {
		this._items = [];
		this._events.emit('basket:changed', { 
			items: this._items, 
			total: this.getTotal(), 
			totalCount: this.getTotalCount() 
		});
	}

	/**
	 * Получает все товары в корзине
	 */
	getItems(): IProduct[] {
		return this._items;
	}

	/**
	 * Получает общую стоимость товаров в корзине
	 */
	getTotal(): number {
		return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	/**
	 * Получает общее количество товаров в корзине
	 */
	getTotalCount(): number {
		return this._items.length;
	}

	/**
	 * Проверяет, есть ли товар в корзине
	 */
	hasItem(id: string): boolean {
		return this._items.some(item => item.id === id);
	}

	/**
	 * Проверяет, можно ли оформить заказ
	 */
	canOrder(): boolean {
		return this._items.length > 0;
	}
}