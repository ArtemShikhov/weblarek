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
    payment: TPayment | '';
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

// Тип для ответа от сервера при получении списка товаров
export interface IApiListResponse<T> {
    items: T[];
    total: number;
}

// Тип для ошибок валидации покупателя
export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейсы моделей
export interface ICatalogModel {
    setItems(items: IProduct[]): void;
    getItemById(id: string): IProduct | undefined;
}

export interface IBasketModel {
    add(itemId: string): void;
    remove(itemId: string): void;
    clear(): void;
    getTotal(): number;
    getItems(): IProduct[];
    getTotalCount(): number;
    hasItem(id: string): boolean;
}

export interface IOrderModel {
    payment: TPayment | '';
    address: string;
    email: string;
    phone: string;
    setField(field: 'payment' | 'address' | 'email' | 'phone', value: string): void;
    validate(): BuyerErrors;
}