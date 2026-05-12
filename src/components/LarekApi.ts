import { Api, IApi } from '../components/base/Api';
import { IProduct } from '../types';

export interface ILarekApi extends IApi {
  getProductList: () => Promise<IProduct[]>;
  postOrder: (order: any) => Promise<any>;
}

export class LarekApi extends Api implements ILarekApi {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  getProductList(): Promise<IProduct[]> {
    return this.get('/products')
      .then((data: { items: IProduct[] }) => data.items);
  }

  postOrder(order: any): Promise<any> {
    return this.post('/order', order);
  }
}