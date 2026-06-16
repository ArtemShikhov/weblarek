import './scss/styles.scss'; 
import { LarekApi } from './components/LarekApi'; 
import { Api } from './components/base/Api'; 
import { EventEmitter } from './components/base/Events'; 
import { CatalogModel } from './models/CatalogModel'; 
import { BasketModel } from './models/BasketModel'; 
import { OrderModel } from './models/OrderModel'; 
import { IProduct, IBuyer } from './types'; 
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

// Store order form element reference for access in event handlers
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

// Handle catalog changes 
events.on('catalog:changed', () => { 
	const products = catalogModel.getItems(); 
	const productCards = products.map(product => { 
		const template = document.getElementById('card-catalog') as HTMLTemplateElement; 
		if (!template) { 
			throw new Error('Card catalog template not found'); 
		} 
		 
		const clone = template.content.cloneNode(true) as HTMLElement; 
		const cardElement = clone.firstElementChild as HTMLElement; 

		const card = new ProductCard(cardElement, events, () => { 
			events.emit('product:select', { id: product.id }); 
		}); 
		card.id = product.id; 
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
		const template = document.getElementById('card-preview') as HTMLTemplateElement; 
		if (!template) { 
			throw new Error('Card preview template not found'); 
		} 
		 
		const clone = template.content.cloneNode(true) as HTMLElement; 
		const previewCard = new PreviewCard(clone.firstElementChild as HTMLElement, events); 
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

		modal.content = clone.firstElementChild as HTMLElement; 
		modal.open(); 
	} 
}); 

// Handle basket remove 
events.on('basket:remove', (data: { id: string }) => { 
	basketModel.remove(data.id); 
}); 

// Handle basket open 
events.on('basket:open', () => { 
	// Create basket view with actual template content
	const template = document.getElementById('basket') as HTMLTemplateElement;
	if (!template) {
		throw new Error('Basket template not found');
	}
	
	const clone = template.content.cloneNode(true) as HTMLElement;
	const basketView = new BasketView(clone.firstElementChild as HTMLElement, events);

	// Get basket items using template 
	const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement; 
	const items = basketModel.getItems(); 
	const basketItems = items.map((item, index) => { 
		if (!itemTemplate) { 
			throw new Error('Card basket template not found'); 
		} 
		 
		const itemClone = itemTemplate.content.cloneNode(true) as HTMLElement; 
		const itemElement = itemClone.firstElementChild as HTMLElement; 

		const basketItem = new BasketItem(itemElement, events, (id) => {
			events.emit('basket:remove', { id });
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

	modal.content = clone.firstElementChild as HTMLElement; 
	modal.open(); 
}); 

// Handle order open 
events.on('order:open', () => { 
	// Create order form and show in modal 
	const template = document.getElementById('order') as HTMLTemplateElement; 
	if (!template) { 
		throw new Error('Order template not found'); 
	} 
	 
	const clone = template.content.cloneNode(true) as HTMLElement; 
	orderFormElement = clone.firstElementChild as HTMLFormElement; 
	const orderForm = new OrderForm(orderFormElement, events); 
	// Set initial values 
	orderForm.payment = orderModel.getData().payment; 
	orderForm.address = orderModel.getData().address; 

	// Prevent default form submission and emit custom event
	orderFormElement.addEventListener('submit', (event) => {
		event.preventDefault();
		events.emit('order:submit');
	});

	modal.content = orderFormElement; 
	modal.open(); 
}); 

// Handle order form changes to enable/disable submit button based on validation
events.on('order:change', (data: { field: string, value: string }) => {
	orderModel.setField(data.field as 'payment' | 'address' | 'email' | 'phone', data.value);
	
	// Validate the order and update submit button state
	const errors = orderModel.validate();
	if(orderFormElement) {
		const submitBtn = orderFormElement.querySelector('.button[type="submit"]') as HTMLButtonElement;
		if(submitBtn) {
			// Обновляем состояние кнопки "Далее" только если мы находимся на первом этапе (адрес и оплата)
			// На этом этапе нас интересует только валидация адреса и способа оплаты
			const currentOrderData = orderModel.getData();
			const currentStepErrors: Partial<Record<keyof IBuyer, string>> = {};
			
			if (!currentOrderData.payment) currentStepErrors.payment = 'Не выбран способ оплаты';
			if (!currentOrderData.address) currentStepErrors.address = 'Не указан адрес';
			
			submitBtn.disabled = Object.keys(currentStepErrors).length > 0;
		}
	}
});

events.on('order:submit', () => { 
	events.emit('order:next'); 
}); 

// Handle order next step 
events.on('order:next', () => { 
	// Move to contact form 
	const template = document.getElementById('contacts') as HTMLTemplateElement; 
	if (!template) { 
		throw new Error('Contacts template not found'); 
	} 
	 
	const clone = template.content.cloneNode(true) as HTMLElement; 
	const contactFormElement = clone.firstElementChild as HTMLFormElement; 
	const contactsForm = new ContactsForm(contactFormElement, events); 
	 
	// Set initial values 
	contactsForm.email = orderModel.getData().email; 
	contactsForm.phone = orderModel.getData().phone; 

	// Validate form initially
	const validateContactForm = () => {
		const data = orderModel.getData();
		const errors: Partial<Record<keyof IBuyer, string>> = {};
		
		if (!data.email) errors.email = 'Введите email';
		if (!data.phone) errors.phone = 'Введите телефон';
		
		const submitBtn = contactFormElement.querySelector('button[type="submit"]') as HTMLButtonElement;
		if (submitBtn) {
			submitBtn.disabled = Object.keys(errors).length > 0;
		}
		
		return errors;
	};

	// Listen for form changes
	events.on('form:change', (data: { field: string, value: string }) => {
		orderModel.setField(data.field as 'email' | 'phone', data.value);
		validateContactForm();
	});

	// Also listen for order changes to ensure button state updates
	events.on('order:changed', () => {
		validateContactForm();
	});

	contactFormElement.addEventListener('submit', (event) => {
		event.preventDefault();
		events.emit('contacts:submit');
	});

	modal.content = contactFormElement; 
	modal.open(); 
	
	// Initial validation
	validateContactForm();
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
		products: basketItemIds,  // Правильно - по интерфейсу IOrder используется поле products
		total: basketTotal // Use the captured total
	}; 
	 
	console.log('Final order object to send:', orderToSend); // Дополнительный лог для проверки 
	console.log('Products array content:', orderToSend.products); // Дополнительный лог содержимого products 
	console.log('Order total value:', orderToSend.total); // Проверим значение total
	 
	// Дополнительная проверка перед отправкой 
	if (!orderToSend.products || !Array.isArray(orderToSend.products) || orderToSend.products.length === 0) { 
		console.error('Products validation failed:', orderToSend.products); 
		return; 
	} 
	 
	// Убедимся, что каждый ID является строкой 
	const allValidIds = orderToSend.products.every(id => typeof id === 'string' && id.trim() !== ''); 
	if (!allValidIds) {
		console.error('Some product IDs are not valid strings:', orderToSend.products);
		return;
	}
	
	larekApi.postOrder(orderToSend) 
		.then(result => { 
			const template = document.getElementById('success') as HTMLTemplateElement; 
			if (!template) { 
				throw new Error('Success template not found'); 
			} 
			 
			const clone = template.content.cloneNode(true) as HTMLElement; 
			const successElement = clone.firstElementChild as HTMLElement; 
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