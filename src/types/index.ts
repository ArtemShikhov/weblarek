export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | null;
}

export interface IApiListResponse<T> {
	total: number;
	items: T[];
}

export interface IOrder {
	payment: TPayment;
	email: string;
	phone: string;
	address: string;
	products: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ICatalogModel {
	setItems(items: IProduct[]): void;
	getItemById(id: string): IProduct | undefined;
	getItems(): IProduct[];
}

export interface IBasketModel {
	add(product: IProduct): void;
	remove(productId: string): void;
	clear(): void;
	getTotal(): number;
	getItems(): IProduct[];
	getTotalCount(): number;
	hasItem(id: string): boolean;
}

export interface IOrderModel {
	setField(field: 'payment' | 'address' | 'email' | 'phone', value: string): void;
	validate(): BuyerErrors;
	getData(): { payment: string, address: string, email: string, phone: string };
}

export type TPayment = 'card' | 'cash';

export interface IBuyer {
	payment: TPayment;
	address: string;
	email: string;
	phone: string;
}

export type BuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
	get<T extends object>(uri: string): Promise<T>;
	post<T extends object>(uri: string, data: object): Promise<T>;
}