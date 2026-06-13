import { IEvents } from '../components/base/Events';
import { IProduct } from '../types';

export class CatalogModel {
	private _items: IProduct[] = [];
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setItems(items: IProduct[]) {
		this._items = items;
		this.events.emit('catalog:changed', { items });
	}

	// Метод для добавления отдельного товара
	addItem(item: IProduct) {
		this._items.push(item);
		this.events.emit('catalog:changed', { items: this._items });
	}

	getItemById(id: string): IProduct | undefined {
		return this._items.find(item => item.id === id);
	}

	getItems(): IProduct[] {
		return this._items;
	}

	// Метод для обновления отдельного товара
	updateItem(id: string, updates: Partial<IProduct>): IProduct | undefined {
		const index = this._items.findIndex(item => item.id === id);
		if (index !== -1) {
			this._items[index] = { ...this._items[index], ...updates };
			this.events.emit('catalog:item:updated', { item: this._items[index] });
			this.events.emit('catalog:changed', { items: this._items });
			return this._items[index];
		}
		return undefined;
	}
}