import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { CatalogModel } from './models/CatalogModel';
import { IProduct, IApiListResponse } from './types';

const baseApi = new Api('https://larek-api.nomoreparties.co', {});
const api = new LarekApi(baseApi);

// Создаем модели данных
const catalogModel = new CatalogModel();

// Загрузка продуктов с сервера
api.getProductList()
  .then((products: IApiListResponse<IProduct>) => {
    catalogModel.setItems(products.items);
    console.log('Products loaded:', catalogModel.getItems());
  })
  .catch((error) => {
    console.error('Error loading products:', error);
  });

console.log('Приложение инициализировано');