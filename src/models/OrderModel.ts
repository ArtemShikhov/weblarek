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
        this.items = value.split(',') as string[]; // преобразуем строку в массив
        break;
      case 'total':
        this.total = Number(value);
        break;
      default:
        throw new Error(`Поле ${field} не существует в модели заказа`);
    }
  }

  validate(): boolean {
    return this.payment !== '' && 
           this.address !== '' && 
           this.email !== '' && 
           this.phone !== '';
  }
}