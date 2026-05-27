import './scss/styles.scss';
import { LarekApi } from './components/LarekApi';
import { Api } from './components/base/Api';
import { BasketModel } from './models/BasketModel';
import { CatalogModel } from './models/CatalogModel';
import { IProduct, IApiListResponse } from './types';

const api = new LarekApi(new Api('https://larek-api.nomoreparties.co'));

const catalogModel = new CatalogModel();
const basketModel = new BasketModel();

api.getProductList()
	.then((products: IApiListResponse<IProduct>) => {
		console.log('Получены данные из API:', products);
		
		catalogModel.setItems(products.items);
		console.log('Данные каталога:', catalogModel.getItems());
		
		// Пример использования корзины - добавляем первый товар из каталога
		if (catalogModel.getItems().length > 0) {
			const firstProduct = catalogModel.getItems()[0];
			basketModel.add(firstProduct);
			console.log('Товар добавлен в корзину:', firstProduct.title);
		}
	})
	.catch((error) => {
		console.error('Ошибка загрузки данных:', error);
	});

console.log('Приложение инициализировано');