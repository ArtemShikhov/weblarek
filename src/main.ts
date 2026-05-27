import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { Api } from './components/base/Api';
import { BasketModel } from './models/BasketModel';
import { CatalogModel } from './models/CatalogModel';
import { OrderModel } from './models/OrderModel';
import { IProduct, IApiListResponse } from './types';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const orderModel = new OrderModel();

larekApi.getProductList()
	.then((products: IApiListResponse<IProduct>) => {
		console.log('Получены данные из API:', products);
		
		catalogModel.setItems(products.items);
		console.log('Данные каталога:', catalogModel.getItems());

		// Тестируем методы каталога
		if (catalogModel.getItems().length > 0) {
			const firstProduct = catalogModel.getItems()[0];
			console.log('Первый товар из каталога:', catalogModel.getItemById(firstProduct.id));
		}

		// Тестируем методы корзины
		if (catalogModel.getItems().length >= 2) {
			const firstProduct = catalogModel.getItems()[0];
			const secondProduct = catalogModel.getItems()[1];

			// Добавляем товары в корзину
			basketModel.add(firstProduct);
			basketModel.add(secondProduct);
			console.log('Товары добавлены в корзину');

			// Проверяем методы корзины
			console.log('Товары в корзине:', basketModel.getItems());
			console.log('Общее количество товаров в корзине:', basketModel.getTotalCount());
			console.log('Общая стоимость товаров в корзине:', basketModel.getTotal());
			console.log('Первый товар есть в корзине:', basketModel.hasItem(firstProduct.id));
			
			// Удаляем один товар
			basketModel.remove(firstProduct.id);
			console.log('После удаления первого товара, осталось товаров:', basketModel.getTotalCount());
			
			// Проверяем, что товара больше нет в корзине
			console.log('Первый товар есть в корзине после удаления:', basketModel.hasItem(firstProduct.id));
			
			// Проверяем getTotal после удаления
			console.log('Общая стоимость после удаления:', basketModel.getTotal());
			
			// Очищаем корзину
			basketModel.clear();
			console.log('Корзина очищена, товаров:', basketModel.getTotalCount());
		}

		// Тестируем методы OrderModel
		orderModel.setField('payment', 'card');
		orderModel.setField('address', 'ул. Примерная, д. 1');
		orderModel.setField('email', 'test@example.com');
		orderModel.setField('phone', '+79991234567');
		
		console.log('Данные заказа:', orderModel.getData());
		console.log('Результат валидации заказа:', orderModel.validate());
	})
	.catch((error) => {
		console.error('Ошибка загрузки данных:', error);
	});

console.log('Приложение инициализировано');