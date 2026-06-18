import './scss/styles.scss'; 
import { LarekApi } from './components/LarekApi'; 
import { Api } from './components/base/Api'; 
import { EventEmitter } from './components/base/Events'; 
import { CatalogModel } from './models/CatalogModel'; 
import { BasketModel } from './models/BasketModel'; 
import { OrderModel } from './models/OrderModel'; 
import { IProduct } from './types'; 
import { API_URL, CDN_URL } from './utils/constants'; 
import { ProductCard } from './components/View/ProductCard'; 
import { PreviewCard } from './components/View/PreviewCard'; 
import { BasketItem } from './components/View/BasketItem'; 
import { Modal } from './components/View/Modal'; 
import { BasketView } from './components/View/BasketView'; 
import { GalleryView } from './components/View/GalleryView'; 
import { OrderForm } from './components/View/OrderForm'; 
import { ContactsForm } from './components/View/ContactsForm'; 
import { Header } from './components/View/Header'; 
import { SuccessView } from './components/View/SuccessView'; 

const api = new Api(API_URL); 
const larekApi = new LarekApi(api); 
const events = new EventEmitter(); 

// Initialize models with events 
const catalogModel = new CatalogModel(events); 
const basketModel = new BasketModel(events); 
const orderModel = new OrderModel(events); 

// Store form element references for access in event handlers 
let orderFormElement: HTMLFormElement | null = null; 

// Get DOM containers 
const modalContainer = document.querySelector<HTMLElement>('.modal'); 
const galleryContainer = document.querySelector<HTMLElement>('.gallery'); 
const headerContainer = document.querySelector<HTMLElement>('.header'); 

if (!modalContainer || !galleryContainer || !headerContainer) { 
	console.error('Required DOM elements not found'); 
	throw new Error('Missing required DOM elements'); 
} 

// Initialize views 
const modal = new Modal(modalContainer, events); 
const galleryView = new GalleryView(galleryContainer, events); 
const header = new Header(headerContainer, events); 

// Initialize forms and views once
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
if (!basketTemplate) {
	throw new Error('Basket template not found');
}
const basketClone = basketTemplate.content.cloneNode(true) as HTMLElement;
const basketView = new BasketView(basketClone.firstElementChild as HTMLElement, events);

const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
if (!orderTemplate) {
	throw new Error('Order template not found');
}
const orderClone = orderTemplate.content.cloneNode(true) as HTMLElement;
orderFormElement = orderClone.firstElementChild as HTMLFormElement;
const orderForm = new OrderForm(orderFormElement, events);

const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
if (!contactsTemplate) {
	throw new Error('Contacts template not found');
}
const contactsClone = contactsTemplate.content.cloneNode(true) as HTMLElement;
const contactsFormElement = contactsClone.firstElementChild as HTMLFormElement;
const contactsForm = new ContactsForm(contactsFormElement, events);

// Helper function to create element from template
const createElementFromTemplate = (templateId: string): HTMLElement => {
	const template = document.getElementById(templateId) as HTMLTemplateElement;
	if (!template) {
		throw new Error(`${templateId} template not found`);
	}
	const clone = template.content.cloneNode(true) as HTMLElement;
	return clone.firstElementChild as HTMLElement;
};

// Handle catalog changes 
events.on('catalog:changed', () => { 
	const products = catalogModel.getItems(); 
	const productCards = products.map(product => { 
		const cardElement = createElementFromTemplate('card-catalog');

		const card = new ProductCard(cardElement, events, () => { 
			events.emit('product:select', { id: product.id }); 
		}); 
		card.title = product.title; 
		card.image = `${CDN_URL}/${product.image}`; 
		card.category = product.category; 
		card.price = product.price; 
		card.description = product.description; 

		return cardElement; 
	}); 

	galleryView.items = productCards; 
}); 

// Handle basket changes 
events.on('basket:changed', () => { 
	header.counter = basketModel.getTotalCount(); 
	
	// Update basket view items
	const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;  
    const items = basketModel.getItems();  
    const basketItems = items.map((item, index) => {  
        if (!itemTemplate) {  
            throw new Error('Card basket template not found');  
        }  
        const itemClone = itemTemplate.content.cloneNode(true) as HTMLElement;  
        const itemElement = itemClone.firstElementChild as HTMLElement;  

        const basketItem = new BasketItem(itemElement, events, () => {
			events.emit('basket:remove', { id: item.id });
		}); 
		basketItem.id = item.id; 
		basketItem.title = item.title; 
		basketItem.price = item.price; 
		basketItem.index = index + 1; 

		return itemElement; 
	}); 

	basketView.items = basketItems; 
	basketView.total = basketModel.getTotal(); 
	basketView.setOrderButtonState(basketModel.getTotalCount() > 0);
}); 

// Handle basket open 
events.on('basket:open', () => { 
	modal.content = basketView.render(); 
	modal.open(); 
}); 

// Handle product selection 
events.on('product:select', (data: { id: string }) => { 
	const product = catalogModel.getItemById(data.id); 
	if (product) { 
		catalogModel.setSelectedProduct(product); 
	} 
}); 

// Handle product selection in catalog model 
events.on('product:selected', (data: { product: IProduct | null }) => { 
	if (data.product) { 
		const product = data.product;
		const cardElement = createElementFromTemplate('card-preview');
		
		const previewCard = new PreviewCard(cardElement, events); 
		previewCard.id = product.id; 
		previewCard.title = product.title; 
		previewCard.image = `${CDN_URL}/${product.image}`; 
		previewCard.category = product.category; 
		previewCard.price = product.price; 
		previewCard.description = product.description; 
		previewCard.setInBasketState(basketModel.hasItem(product.id)); 

		previewCard.setOnClick(() => { 
			if (basketModel.hasItem(product.id)) { 
				basketModel.remove(product.id); 
			} else { 
				basketModel.add(product); 
			} 
			modal.close(); 
		}); 

		modal.content = cardElement; 
		modal.open(); 
	} 
}); 

// Handle basket remove 
events.on('basket:remove', (data: { id: string }) => { 
	basketModel.remove(data.id); 
}); 

// Handle order open 
events.on('order:open', () => { 
	// Set initial values 
	const currentData = orderModel.getData();
	orderForm.payment = currentData.payment; 
	orderForm.address = currentData.address; 

	modal.content = orderFormElement; 
	modal.open(); 
}); 

// Handle order form changes to update model data
events.on('order:change', (data: { field: string, value: string }) => {
	orderModel.setField(data.field as 'payment' | 'address' | 'email' | 'phone', data.value);
});

// Handle form:change event for contacts form fields
events.on('form:change', (data: { field: string, value: string }) => {
	orderModel.setField(data.field as 'email' | 'phone', data.value);
});

// Handle order submit 
events.on('order:submit', () => { 
	events.emit('order:next'); 
}); 

// Handle order next step 
events.on('order:next', () => { 
	// Set initial values 
	const currentData = orderModel.getData();
	contactsForm.email = currentData.email; 
	contactsForm.phone = currentData.phone; 

	modal.content = contactsFormElement; 
	modal.open(); 
}); 

// Handle order changes to update form states
events.on('order:changed', () => {
    const currentOrderData = orderModel.getData();
    const errors = orderModel.validate();
    
    contactsForm.email = currentOrderData.email;  
    contactsForm.phone = currentOrderData.phone; 
    orderForm.payment = currentOrderData.payment;  
    orderForm.address = currentOrderData.address;
    
    // Filter out undefined/null values
    const contactErrorsArray = [];
    if (errors.email) contactErrorsArray.push(errors.email);
    if (errors.phone) contactErrorsArray.push(errors.phone);
    const contactErrors = contactErrorsArray.join('; ');
    
    const orderErrorsArray = [];
    if (errors.address) orderErrorsArray.push(errors.address);
    if (errors.payment) orderErrorsArray.push(errors.payment);
    const orderErrors = orderErrorsArray.join('; ');
    
    const hasContactErrors = !!(errors.email || errors.phone);
    const hasOrderErrors = !!(errors.address || errors.payment);
    
    contactsForm.setSubmitState(!hasContactErrors);
    contactsForm.setErrors(contactErrors);
    
    orderForm.setSubmitState(!hasOrderErrors);
    orderForm.setErrors(orderErrors);
});

events.on('contacts:submit', () => { 
	// Process the order submission 
	const orderData = {...orderModel.getData()}; // Create a copy of order data
	const basketItems = [...basketModel.getItems()]; // Create a copy of basket items
	const basketTotal = basketModel.getTotal(); // Capture total at the moment of submission
	
	// Check if basket is empty 
	if (basketItems.length === 0) { 
		console.error('Cannot submit order: basket is empty'); 
		return; // Don't proceed with order submission 
	} 
	
	// Extract IDs from the basket items 
	const basketItemIds = basketItems.map(item => item.id); 
	
	console.log('Basket item IDs extracted:', basketItemIds); // Логирование ID товаров 
	console.log('Type of each ID:', basketItemIds.map(id => typeof id)); // Проверка типа каждого ID 
	console.log('Basket items from copy:', basketItems); // Проверим, что данные скопированы правильно
	console.log('Basket total captured:', basketTotal); // Зафиксируем сумму
	
	// Verify that we have valid item IDs before submitting 
	if (basketItemIds.length === 0 || basketItemIds.some(id => !id)) { 
		console.error('Cannot submit order: invalid item IDs', basketItemIds); 
		return; 
	} 
	
	console.log('Submitting order with data:', { 
		orderData, 
		products: basketItemIds, 
		total: basketTotal 
	}); 
	
	// Создаем объект заказа в соответствии с интерфейсом IOrder
	const orderToSend = { 
		email: orderData.email, 
		phone: orderData.phone, 
		address: orderData.address, 
		payment: orderData.payment, 
		items: basketItemIds,  // Изменено с 'products' на 'items' согласно спецификации API
		total: basketTotal // Use the captured total
	}; 
	
	console.log('Final order object to send:', orderToSend); // Дополнительный лог для проверки 
	console.log('Items array content:', orderToSend.items); // Дополнительный лог содержимого items 
	console.log('Order total value:', orderToSend.total); // Проверим значение total
	
	// Дополнительная проверка перед отправкой 
	if (!orderToSend.items || !Array.isArray(orderToSend.items) || orderToSend.items.length === 0) { 
		console.error('Items validation failed:', orderToSend.items); 
		return; 
	} 
	
	// Убедимся, что каждый ID является строкой 
	const allValidIds = orderToSend.items.every(id => typeof id === 'string' && id.trim() !== ''); 
	if (!allValidIds) {
		console.error('Some product IDs are not valid strings:', orderToSend.items);
		return;
	}
	
	larekApi.postOrder(orderToSend) 
		.then(result => { 
			const successElement = createElementFromTemplate('success');
			const successView = new SuccessView(successElement, events);
			successView.total = result.total;
			modal.content = successElement; 
			 
			// Clear basket and order data 
			basketModel.clear(); 
			orderModel.clear(); 
			 
			// Add event listener to close button 
			const closeButton = successElement.querySelector('.order-success__close'); 
			if (closeButton) { 
				closeButton.addEventListener('click', () => { 
					modal.close(); 
				}); 
			} 
		}) 
		.catch(error => { 
			console.error('Error submitting order:', error); 
			// Показываем сообщение об ошибке пользователю 
			alert('Ошибка при оформлении заказа: ' + (error.message || 'Неизвестная ошибка')); 
		}); 
}); 

// Handle modal close 
events.on('modal:close', () => { 
	// Clean up if needed 
}); 

// Load initial data 
larekApi.getProductList() 
	.then((result) => { 
		catalogModel.setItems(result.items); 
	}) 
	.catch((error) => { 
		console.error('Error loading products:', error); 
	});