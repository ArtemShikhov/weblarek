import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { CatalogModel } from './models/CatalogModel';
import { BasketModel } from './models/BasketModel';
import { OrderModel } from './models/OrderModel';

// Создаем экземпляры всех трех классов-моделей данных
const catalogModel = new CatalogModel();
const basketModel = new BasketModel();
const orderModel = new OrderModel();

// Проверяем работу методов моделей данных
console.log('=== Тестирование моделей данных ===');

// Тестируем модель каталога
console.log('Исходный массив товаров из модели каталога:', catalogModel.items);

catalogModel.setItems(apiProducts.items);
console.log('Массив товаров после установки:', catalogModel.getItems());

// Получаем конкретный товар по ID
const firstProductId = apiProducts.items[0].id;
const productFromCatalog = catalogModel.getItemById(firstProductId);
console.log(`Товар с ID ${firstProductId}:`, productFromCatalog);

// Тестируем модель корзины
console.log('\n=== Тестирование корзины ===');
console.log('Исходное состояние корзины:', basketModel.items);
console.log('Исходная общая стоимость:', basketModel.getTotal());

// Добавляем товар в корзину
basketModel.add(firstProductId);
console.log('После добавления товара:', basketModel.items);

// Проверяем наличие товара в корзины
console.log('Товар в корзине:', basketModel.items.includes(firstProductId));

// Удаляем товар из корзины
basketModel.remove(firstProductId);
console.log('После удаления товара:', basketModel.items);

// Добавляем несколько товаров для проверки общей стоимости
basketModel.add(firstProductId);
basketModel.add(apiProducts.items[1].id);
basketModel.setTotal(2200); // Устанавливаем общую стоимость
console.log('После добавления двух товаров:', basketModel.items);
console.log('Обновленная общая стоимость:', basketModel.getTotal());

// Тестируем модель заказа
console.log('\n=== Тестирование модели заказа ===');
console.log('Исходные данные заказа:', {
    payment: orderModel.payment,
    address: orderModel.address,
    email: orderModel.email,
    phone: orderModel.phone
});

// Устанавливаем значения полей
orderModel.setField('payment', 'card');
orderModel.setField('address', 'Москва, ул. Примерная, д. 10');
orderModel.setField('email', 'test@example.com');
orderModel.setField('phone', '+7 (123) 456-78-90');

console.log('После установки значений:', {
    payment: orderModel.payment,
    address: orderModel.address,
    email: orderModel.email,
    phone: orderModel.phone
});

// Проверяем валидацию
console.log('Результат валидации:', orderModel.validate());

// Очищаем корзину
basketModel.clear();
console.log('Корзина после очистки:', basketModel.items);

// Загружаем данные с сервера
import { LarekApi } from './components/LarekApi';
import { AppState } from './models/AppState';
import { EventEmitter } from './components/base/Events';

// Создаем экземпляр EventEmitter
const events = new EventEmitter();

// Создаем API с указанием базового URL из констант
const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;
const api = new LarekApi(API_URL);

// Создаем глобальное состояние приложения
const appState = new AppState(events);

// Загрузка продуктов с сервера
api.getProductList()
  .then(products => {
    appState.catalog = products;
    console.log('Товары успешно загружены с сервера:', products);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });

console.log('Приложение инициализировано');