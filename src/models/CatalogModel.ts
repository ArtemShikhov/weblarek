import { ICatalogModel, IProduct } from '../types';

export class CatalogModel implements ICatalogModel {
  private items: IProduct[] = [];

  constructor() {}

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  getItems(): IProduct[] {
    return this.items;
  }
}