import { IOrderModel } from '../types';

export class OrderModel implements IOrderModel {
  payment: string = '';
  address: string = '';
  email: string = '';
  phone: string = '';
  items: string[] = [];
  total: number = 0;

  constructor() {}

  setField(field: string, value: string): void {
    switch(field) {
      case 'payment':
        this.payment = value;
        break;
      case 'address':
        this.address = value;
        break;
      case 'email':
        this.email = value;
        break;
      case 'phone':
        this.phone = value;
        break;
      case 'items':
        this.items = Array.isArray(value) ? value : value.split(',').filter(item => item.trim());
        break;
      case 'total':
        this.total = Number(value);
        break;
      default:
        throw new Error(`Поле ${field} не существует в модели заказа`);
    }
  }

  validate(): {[field: string]: string} {
    const errors: {[field: string]: string} = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }
    if (!this.address) {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}