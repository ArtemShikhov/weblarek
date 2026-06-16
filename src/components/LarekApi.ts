import { IApi, IProduct, IOrder, IOrderResult } from '../types';

export interface ILarekApi {
  getProductList: () => Promise<IApiListResponse<IProduct>>;
  postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi implements ILarekApi {
  constructor(private api: IApi) {}

  getProductList(): Promise<IApiListResponse<IProduct>> {
    return this.api.get<IApiListResponse<IProduct>>('/product/');
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    // Преобразуем объект заказа для соответствия ожидаемому формату API
    // API может ожидать поле 'items' вместо 'products'
    const orderForApi = {
      ...order,
      items: order.products, // Преобразуем products в items для API
      products: undefined // Удаляем оригинальное поле, чтобы избежать конфликта
    };
    
    // Удалим undefined поля
    const cleanedOrder = Object.keys(orderForApi).reduce((acc, key) => {
      if (orderForApi[key] !== undefined) {
        acc[key] = orderForApi[key];
      }
      return acc;
    }, {});

    return this.api.post<IOrderResult>('/order', cleanedOrder);
  }
}