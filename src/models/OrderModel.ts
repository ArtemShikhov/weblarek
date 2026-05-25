import { IOrderModel } from '../types';

export class OrderModel implements IOrderModel {
  payment: 'card' | 'cash' | '' = '';
  address: string = '';
  email: string = '';
  phone: string = '';

  constructor() {}

  setField(field: 'payment' | 'address' | 'email' | 'phone', value: string): void {
    switch(field) {
      case 'payment':
        this.payment = value as 'card' | 'cash' | '';
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
      default:
        throw new Error(`Поле ${field} не существует в модели заказа`);
    }
  }

  validate(): Partial<Record<keyof Pick<IOrderModel, 'payment' | 'address' | 'email' | 'phone'>, string>> {
    const errors: Partial<Record<keyof Pick<IOrderModel, 'payment' | 'address' | 'email' | 'phone'>, string>> = {};

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