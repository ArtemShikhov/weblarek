import { IBasketModel, IProduct } from '../types';

export class BasketModel implements IBasketModel {
  private items: IProduct[] = [];

  constructor() {}

  add(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.items.push(product);
    }
  }

  remove(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((sum, product) => sum + (product.price || 0), 0);
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getTotalCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}