import { IEvents } from '../components/base/Events';
import { IProduct } from '../types';

export class CatalogModel {
	private _items: IProduct[] = [];
	private _selectedProduct: IProduct | null = null;
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setItems(items: IProduct[]) {
		this._items = items;
		this.events.emit('catalog:changed', { items });
	}

	getItemById(id: string): IProduct | undefined {
		return this._items.find(item => item.id === id);
	}

	getItems(): IProduct[] {
		return this._items;
	}

	// Метод для установки выбранного продукта
	setSelectedProduct(product: IProduct | null) {
		this._selectedProduct = product;
		this.events.emit('product:selected', { product });
	}

	// Метод для получения выбранного продукта
	getSelectedProduct(): IProduct | null {
		return this._selectedProduct;
	}
}