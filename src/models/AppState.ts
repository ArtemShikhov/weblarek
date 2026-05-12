import { EventEmitter } from '../components/base/Events';
import { IProduct, IAppState } from '../types/index';

/**
 * Модель данных для всего приложения
 */
export class AppState implements IAppState {
  private _catalog: IProduct[] = [];
  private _basket: string[] = [];
  private _preview: string | null = null;
  private _order: { payment: string; address: string; email: string; phone: string } | null = null;

  constructor(private events: EventEmitter) {}

  // Геттеры для данных
  get catalog(): IProduct[] {
    return this._catalog;
  }

  get basket(): string[] {
    return this._basket;
  }

  get preview(): string | null {
    return this._preview;
  }

  get order(): { payment: string; address: string; email: string; phone: string } | null {
    return this._order;
  }

  // Установка каталога товаров
  setCatalog(items: IProduct[]): void {
    this._catalog = items;
    this.events.emit('items:updated', { catalog: this._catalog });
  }

  // Добавление товара в корзину
  addToBasket(id: string): void {
    if (!this._basket.includes(id)) {
      this._basket.push(id);
      this.events.emit('basket:change', this._basket);
    }
  }

  // Удаление товара из корзины
  removeFromBasket(id: string): void {
    this._basket = this._basket.filter(item => item !== id);
    this.events.emit('basket:change', this._basket);
  }

  // Получение текущей корзины с информацией о товарах
  getBasketItems(): IProduct[] {
    return this._catalog.filter(product => this._basket.includes(product.id));
  }

  // Получение общей стоимости корзины
  getTotalBasketCost(): number {
    return this.getBasketItems().reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // Установка товара для предварительного просмотра
  setPreview(item: IProduct): void {
    this._preview = item.id;
    this.events.emit('preview:change', item);
  }

  // Очистка предварительного просмотра
  clearPreview(): void {
    this._preview = null;
  }

  // Установка данных заказа
  setOrderField(field: keyof typeof this._order, value: string): void {
    if (this._order) {
      this._order[field] = value;
    } else {
      this._order = {
        payment: '',
        address: '',
        email: '',
        phone: ''
      };
      this._order[field] = value;
    }
    this.events.emit('order:change', { ...this._order });
  }

  // Сброс заказа
  resetOrder(): void {
    this._order = null;
  }

  // Проверка, все ли данные заказа заполнены
  validateOrder(): boolean {
    if (!this._order) return false;
    
    return this._order.payment !== '' && 
           this._order.address !== '' && 
           this._order.email !== '' && 
           this._order.phone !== '';
  }
}