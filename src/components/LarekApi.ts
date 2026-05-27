import { IApi, IProduct, IOrder, IOrderResult, IApiListResponse } from '../types';

export interface ILarekApi {
  getProductList: () => Promise<IApiListResponse<IProduct>>;
  postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
  constructor(private api: IApi) {}

  getProductList(): Promise<IApiListResponse<IProduct>> {
    return this.api.get<IApiListResponse<IProduct>>('/products');
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order', order);
  }
}