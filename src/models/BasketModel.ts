import { IBasketModel, IProduct } from '../types';

export class BasketModel implements IBasketModel {
  private items: string[] = [];

  constructor(private catalog: { getProductById: (id: string) => IProduct | undefined }) {}

  add(itemId: string): void {
    if (!this.hasItem(itemId)) {
      this.items.push(itemId);
    }
  }

  remove(itemId: string): void {
    this.items = this.items.filter(id => id !== itemId);
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((sum, id) => {
      const product = this.catalog.getProductById(id);
      return sum + (product?.price || 0);
    }, 0);
  }

  getItems(): IProduct[] {
    return this.items.map(id => this.catalog.getProductById(id)).filter(Boolean) as IProduct[];
  }

  getTotalCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.includes(id);
  }
}