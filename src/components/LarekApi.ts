import { Api, IApi } from '../components/base/Api';
import { IProduct, IOrder, IOrderResult } from '../types';

export interface ILarekApi extends IApi {
  getProductList: () => Promise<IProduct[]>;
  postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/products')
      .then((data: { items: IProduct[] }) => data.items);
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order);
  }
}