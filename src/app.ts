import { LarekApi } from './components/LarekApi';
import { AppState } from './models/AppState';
import { EventEmitter } from './components/base/Events';

// Создаем экземпляр EventEmitter
const events = new EventEmitter();

// Создаем API с указанием базового URL из констант
const api = new LarekApi(API_URL);

// Создаем глобальное состояние приложения
const appState = new AppState(events);

// Загрузка продуктов с сервера
api.getProductList()
  .then(products => {
    appState.setCatalog(products);
    console.log('Товары успешно загружены:', products);
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });

console.log('Приложение инициализировано');