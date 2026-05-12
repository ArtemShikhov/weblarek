import { IBasketModel } from '../types';

export class BasketModel implements IBasketModel {
  items: string[] = [];
  total: number = 0;

  constructor() {}

  add(itemId: string): void {
    if (!this.items.includes(itemId)) {
      this.items.push(itemId);
    }
  }

  remove(itemId: string): void {
    this.items = this.items.filter(id => id !== itemId);
  }

  clear(): void {
    this.items = [];
    this.total = 0;
  }

  getTotal(): number {
    return this.total;
  }

  setTotal(total: number): void {
    this.total = total;
  }
}