import { LarekApi } from './components/LarekApi';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { CatalogModel } from './models/CatalogModel';
import { BasketModel } from './models/BasketModel';
import { OrderModel } from './models/OrderModel';

// Создаем экземпляр EventEmitter
const events = new EventEmitter();

// Создаем базовый API с указанием базового URL из констант
const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;
const baseApi = new Api(API_URL);

// Создаем LarekApi с использованием базового API
const api = new LarekApi(baseApi);

// Создаем модели данных
const catalogModel = new CatalogModel();
const basketModel = new BasketModel({
  getProductById: (id: string) => catalogModel.getItemById(id)
});
const orderModel = new OrderModel();

// Загрузка продуктов с сервера
api.getProductList()
  .then(products => {
    catalogModel.setItems(products);
    console.log('Товары успешно загружены:', products);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });

console.log('Приложение инициализировано');