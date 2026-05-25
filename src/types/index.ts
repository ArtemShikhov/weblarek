export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип для способа оплаты
export type TPayment = 'card' | 'cash';

// Интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Интерфейс заказа
export interface IOrder extends IBuyer {
    items: string[];
    total: number;
}

// Интерфейс результата заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Интерфейсы моделей
export interface ICatalogModel {
    items: IProduct[];
    setItems(items: IProduct[]): void;
    getItemById(id: string): IProduct | undefined;
}

export interface IBasketModel {
    items: string[];
    total: number;
    add(itemId: string): void;
    remove(itemId: string): void;
    clear(): void;
    getTotal(): number;
    setTotal(total: number): void;
}

export interface IOrderModel extends IBuyer {
    items: string[];
    total: number;
    setField(field: string, value: string): void;
    validate(): boolean;
}