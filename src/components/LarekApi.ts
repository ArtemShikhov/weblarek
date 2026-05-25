import { IApi } from '../types';
import { IProduct, IOrder, IOrderResult, IApiListResponse } from '../types';

export interface ILarekApi extends IApi {
  getProductList: () => Promise<IProduct[]>;
  postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
  constructor(private api: IApi) {}

  get<T extends object>(uri: string): Promise<T> {
    return this.api.get<T>(uri);
  }

  post<T extends object>(uri: string, data: object): Promise<T> {
    return this.api.post<T>(uri, data);
  }

  getProductList(): Promise<IProduct[]> {
    return this.get<IApiListResponse<IProduct>>('/products')
      .then((data) => data.items);
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>('/order', order);
  }
}