import { IOrderModel, TPayment, BuyerErrors } from '../types';

export class OrderModel implements IOrderModel {
  payment: TPayment | '' = '';
  address: string = '';
  email: string = '';
  phone: string = '';

  constructor() {}

  setField(field: 'payment' | 'address' | 'email' | 'phone', value: string): void {
    switch(field) {
      case 'payment':
        this.payment = value as TPayment;
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
    }
  }

  validate(): BuyerErrors {
    const errors: BuyerErrors = {};
    
    if (!this.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    
    if (!this.address) {
      errors.address = 'Необходимо указать адрес';
    }
    
    if (!this.email) {
      errors.email = 'Необходимо указать email';
    }
    
    if (!this.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    
    return errors;
  }
}