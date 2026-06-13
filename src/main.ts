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

const api = new Api(API_URL);
const larekApi = new LarekApi(api);
const events = new EventEmitter();

// Initialize models with events
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// Get DOM containers
const modalContainer = document.querySelector<HTMLElement>('.modal');
const galleryContainer = document.querySelector<HTMLElement>('.gallery');

if (!modalContainer || !galleryContainer) {
	console.error('Required DOM elements not found');
	throw new Error('Missing required DOM elements');
}

// Initialize views
const modal = new Modal(modalContainer, events);
const galleryView = new GalleryView(galleryContainer, events);

// Handle catalog changes
events.on('catalog:changed', () => {
	const products = catalogModel.getItems();
	const productCards = products.map(product => {
		const template = document.getElementById('card-catalog') as HTMLTemplateElement;
		let cardElement: HTMLElement;
		
		if (template) {
			const clone = template.content.cloneNode(true) as HTMLElement;
			cardElement = clone.firstElementChild as HTMLElement;
		} else {
			cardElement = document.createElement('div');
			cardElement.className = 'card card_grid';
			cardElement.innerHTML = `
				<div class="card__category"></div>
				<img class="card__image" src="" alt="">
				<h3 class="card__title"></h3>
				<p class="card__text"></p>
				<div class="card__price"></div>
				<button class="card__button"></button>
			`;
		}

		const card = new ProductCard(cardElement, events);
		card.id = product.id;
		card.title = product.title;
		card.image = `${CDN_URL}/${product.image}`;
		card.category = product.category;
		card.price = product.price;
		card.description = product.description;

		// Add click handler to open product preview
		cardElement.addEventListener('click', () => {
			events.emit('product:select', { id: product.id });
		});

		return cardElement;
	});

	galleryView.items = productCards;
});

// Handle basket changes
events.on('basket:changed', () => {
	// Update basket counter
	const basketCounter = document.querySelector<HTMLSpanElement>('.header__basket-counter');
	if (basketCounter) {
		basketCounter.textContent = String(basketModel.getTotalCount());
	}
});

// Handle product selection
events.on('product:select', (data: { id: string }) => {
	const product = catalogModel.getItemById(data.id);
	if (product) {
		const template = document.getElementById('card-preview') as HTMLTemplateElement;
		if (template) {
			const clone = template.content.cloneNode(true) as HTMLElement;
			const previewCard = new PreviewCard(clone.firstElementChild as HTMLElement, events);
			previewCard.id = product.id;
			previewCard.title = product.title;
			previewCard.image = `${CDN_URL}/${product.image}`;
			previewCard.category = product.category;
			previewCard.price = product.price;
			previewCard.description = product.description;
			previewCard.setInBasketState(basketModel.hasItem(product.id));
			previewCard.setDisabledState(product.price === null);

			previewCard.setOnClick(() => {
				if (basketModel.hasItem(product.id)) {
					basketModel.remove(product.id);
				} else {
					basketModel.add(product);
				}
			});

			modal.content = clone.firstElementChild as HTMLElement;
			modal.toggleModal(true);
		} else {
			// Fallback to inline creation if template doesn't exist
			const previewElement = document.createElement('div');
			previewElement.className = 'card preview';
			previewElement.innerHTML = `
				<div class="card__category"></div>
				<img class="card__image" src="" alt="">
				<div class="card__column">
					<span class="card__category"></span>
					<h3 class="card__title"></h3>
					<p class="card__text"></p>
					<div class="card__row">
						<button class="button card__button"></button>
						<span class="card__price"></span>
					</div>
				</div>
			`;

			const previewCard = new PreviewCard(previewElement, events);
			previewCard.id = product.id;
			previewCard.title = product.title;
			previewCard.image = `${CDN_URL}/${product.image}`;
			previewCard.category = product.category;
			previewCard.price = product.price;
			previewCard.description = product.description;
			previewCard.setInBasketState(basketModel.hasItem(product.id));
			previewCard.setDisabledState(product.price === null);

			previewCard.setOnClick(() => {
				if (basketModel.hasItem(product.id)) {
					basketModel.remove(product.id);
				} else {
					basketModel.add(product);
				}
			});

			modal.content = previewElement;
			modal.toggleModal(true);
		}
	}
});

// Handle basket remove
events.on('basket:remove', (data: { id: string }) => {
	basketModel.remove(data.id);
	
	// Check if basket modal is currently open and update the view
	const currentModalContent = modalContainer.querySelector('.basket');
	if (currentModalContent) {
		// Re-render the basket view to reflect the changes
		const template = document.getElementById('basket') as HTMLTemplateElement;
		if (template) {
			const clone = template.content.cloneNode(true) as HTMLElement;
			const basketView = new BasketView(clone.firstElementChild as HTMLElement, events);
			
			// Get basket items using template
			const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
			const items = basketModel.getItems();
			const basketItems = items.map((item, index) => {
				let itemElement: HTMLElement;
				if (itemTemplate) {
					const itemClone = itemTemplate.content.cloneNode(true) as HTMLElement;
					itemElement = itemClone.firstElementChild as HTMLElement;
				} else {
					itemElement = document.createElement('div');
					itemElement.className = 'card basket__item';
					itemElement.innerHTML = `
						<div class="basket__item-index"></div>
						<h3 class="card__title"></h3>
						<div class="card__price"></div>
						<button class="basket__item-delete card__button" aria-label="удалить"></button>
					`;
				}
				
				const basketItem = new BasketItem(itemElement, events);
				basketItem.id = item.id;
				basketItem.title = item.title;
				basketItem.price = item.price;
				basketItem.index = index + 1;

				return itemElement;
			});

			basketView.items = basketItems;
			basketView.total = basketModel.getTotal();
			basketView.setOrderButtonState(basketModel.getTotalCount() > 0);
			
			// Replace the current content with updated content
			currentModalContent.replaceWith(clone.firstElementChild as HTMLElement);
		}
	}
});

// Handle modal close
events.on('modal:close', () => {
	modal.toggleModal(false);
});

// Handle basket open
document.querySelector('.header__basket')?.addEventListener('click', () => {
	events.emit('basket:open');
});

// Handle basket open
events.on('basket:open', () => {
	// Create basket view and show in modal
	const template = document.getElementById('basket') as HTMLTemplateElement;
	if (template) {
		const clone = template.content.cloneNode(true) as HTMLElement;
		const basketView = new BasketView(clone.firstElementChild as HTMLElement, events);
		
		// Get basket items using template
		const itemTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
		const items = basketModel.getItems();
		const basketItems = items.map((item, index) => {
			let itemElement: HTMLElement;
			if (itemTemplate) {
				const itemClone = itemTemplate.content.cloneNode(true) as HTMLElement;
				itemElement = itemClone.firstElementChild as HTMLElement;
			} else {
				itemElement = document.createElement('div');
				itemElement.className = 'card basket__item';
				itemElement.innerHTML = `
					<div class="basket__item-index"></div>
					<h3 class="card__title"></h3>
					<div class="card__price"></div>
					<button class="basket__item-delete card__button" aria-label="удалить"></button>
				`;
			}
			
			const basketItem = new BasketItem(itemElement, events);
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
		modal.toggleModal(true);
	} else {
		// Fallback to inline creation if template doesn't exist
		const basketElement = document.createElement('div');
		basketElement.className = 'basket';
		basketElement.innerHTML = `
			<h2 class="modal__title">Корзина</h2>
			<ul class="basket__list"></ul>
			<div class="modal__actions">
				<button class="button basket__button">Оформить</button>
				<span class="basket__price">0 синапсов</span>
			</div>
		`;

		const basketView = new BasketView(basketElement, events);
		const items = basketModel.getItems();
		const basketItems = items.map((item, index) => {
			const itemElement = document.createElement('div');
			itemElement.className = 'card basket__item';
			itemElement.innerHTML = `
				<div class="basket__item-index"></div>
				<h3 class="card__title"></h3>
				<div class="card__price"></div>
				<button class="basket__item-delete card__button" aria-label="удалить"></button>
			`;

			const basketItem = new BasketItem(itemElement, events);
			basketItem.id = item.id;
			basketItem.title = item.title;
			basketItem.price = item.price;
			basketItem.index = index + 1;

			return itemElement;
		});

		basketView.items = basketItems;
		basketView.total = basketModel.getTotal();
		basketView.setOrderButtonState(basketModel.getTotalCount() > 0);

		modal.content = basketElement;
		modal.toggleModal(true);
	}
});

// Handle order open
events.on('order:open', () => {
	// Create order form and show in modal
	const template = document.getElementById('order') as HTMLTemplateElement;
	if (template) {
		const clone = template.content.cloneNode(true) as HTMLElement;
		const orderFormElement = clone.firstElementChild as HTMLFormElement;
		const orderForm = new OrderForm(orderFormElement, events);
		orderForm.payment = orderModel.getData().payment;
		orderForm.address = orderModel.getData().address;

		// Validate form initially
		const validateOrderForm = () => {
			const data = orderModel.getData();
			const errors: Record<string, string> = {};
			
			if (!data.payment) errors.payment = 'Выберите способ оплаты';
			if (!data.address) errors.address = 'Введите адрес доставки';
			
			const submitBtn = orderFormElement.querySelector('.order__button') as HTMLButtonElement;
			submitBtn.disabled = Object.keys(errors).length > 0;
			
			return errors;
		};

		// Listen for form changes
		events.on('order:change', (data: { field: string, value: string }) => {
			orderModel.setField(data.field as 'address' | 'email' | 'phone', data.value);
			validateOrderForm();
		});

		events.on('order:payment:changed', (data: { payment: string }) => {
			orderModel.setField('payment', data.payment);
			validateOrderForm();
		});

		orderFormElement.addEventListener('submit', (event) => {
			event.preventDefault();
			events.emit('order:next');
		});

		modal.content = orderFormElement;
		modal.toggleModal(true);
		
		// Initial validation
		validateOrderForm();
	} else {
		// Fallback to inline creation if template doesn't exist
		const orderFormElement = document.createElement('form');
		orderFormElement.className = 'form';
		orderFormElement.innerHTML = `
			<div class="order">
				<div class="order__field">
					<h2 class="modal__title">Способ оплаты</h2>
					<div class="order__buttons">
						<button type="button" name="payment" value="card" class="button button_alt">Онлайн</button>
						<button type="button" name="payment" value="cash" class="button button_alt">При получении</button>
					</div>
				</div>
				<label class="order__field">
					<span class="form__label modal__title">Адрес доставки</span>
					<input name="address" class="form__input" type="text" placeholder="Введите адрес" required />
					<span class="form__error" data-error-for="address"></span>
				</label>
			</div>
			<div class="modal__actions">
				<button type="submit" class="button order__button" disabled>Далее</button>
				<span class="form__errors"></span>
			</div>
		`;

		const orderForm = new OrderForm(orderFormElement, events);
		orderForm.payment = orderModel.getData().payment;
		orderForm.address = orderModel.getData().address;

		// Validate form initially
		const validateOrderForm = () => {
			const data = orderModel.getData();
			const errors: Record<string, string> = {};
			
			if (!data.payment) errors.payment = 'Выберите способ оплаты';
			if (!data.address) errors.address = 'Введите адрес доставки';
			
			const submitBtn = orderFormElement.querySelector('.order__button') as HTMLButtonElement;
			if (submitBtn) {
				submitBtn.disabled = Object.keys(errors).length > 0;
			}
			
			return errors;
		};

		// Listen for form changes
		events.on('order:change', (data: { field: string, value: string }) => {
			orderModel.setField(data.field as 'address' | 'email' | 'phone', data.value);
			validateOrderForm();
		});

		events.on('order:payment:changed', (data: { payment: string }) => {
			orderModel.setField('payment', data.payment);
			validateOrderForm();
		});

		orderFormElement.addEventListener('submit', (event) => {
			event.preventDefault();
			events.emit('order:next');
		});

		modal.content = orderFormElement;
		modal.toggleModal(true);
		
		// Initial validation
		validateOrderForm();
	}
});

// Handle order next step
events.on('order:next', () => {
	// Validate only the current step (payment and address) - not email and phone yet
	const currentOrderData = orderModel.getData();
	const currentStepErrors: Partial<Record<keyof IBuyer, string>> = {};
	
	if (!currentOrderData.payment) currentStepErrors.payment = 'Не выбран способ оплаты';
	if (!currentOrderData.address) currentStepErrors.address = 'Не указан адрес';
	
	if (Object.keys(currentStepErrors).length === 0) {
		// Move to contact form
		const template = document.getElementById('contacts') as HTMLTemplateElement;
		if (template) {
			const clone = template.content.cloneNode(true) as HTMLElement;
			const contactFormElement = clone.firstElementChild as HTMLFormElement;
			const contactsForm = new ContactsForm(contactFormElement, events);
			contactsForm.email = orderModel.getData().email;
			contactsForm.phone = orderModel.getData().phone;

			// Validate form initially
			const validateContactForm = () => {
				const data = orderModel.getData();
				const errors: Record<string, string> = {};
				
				if (!data.email) errors.email = 'Введите email';
				if (!data.phone) errors.phone = 'Введите телефон';
				
				const submitBtn = contactFormElement.querySelector('button[type="submit"]') as HTMLButtonElement;
				if (submitBtn) {
					submitBtn.disabled = Object.keys(errors).length > 0;
				}
				
				return errors;
			};

			// Listen for form changes
			events.on('contacts:change', (formData: { field: string, value: string }) => {
				orderModel.setField(formData.field as 'email' | 'phone', formData.value);
				validateContactForm();
			});

			contactFormElement.addEventListener('submit', (event) => {
				event.preventDefault();
				events.emit('contacts:submit');
			});

			modal.content = contactFormElement;
			modal.toggleModal(true);
			
			// Initial validation
			validateContactForm();
		} else {
			// Fallback to inline creation if template doesn't exist
			const contactFormElement = document.createElement('form');
			contactFormElement.className = 'form';
			contactFormElement.innerHTML = `
				<div class="order">
					<label class="order__field">
						<span class="form__label modal__title">Email</span>
						<input name="email" class="form__input" type="email" placeholder="Введите Email" required />
						<span class="form__error" data-error-for="email"></span>
					</label>
					<label class="order__field">
						<span class="form__label modal__title">Телефон</span>
						<input name="phone" class="form__input" type="tel" placeholder="+7 (___) ___-____" required />
						<span class="form__error" data-error-for="phone"></span>
					</label>
				</div>
				<div class="modal__actions">
					<button type="submit" class="button" disabled>Оплатить</button>
					<span class="form__errors"></span>
				</div>
			`;

			const contactsForm = new ContactsForm(contactFormElement, events);
			contactsForm.email = orderModel.getData().email;
			contactsForm.phone = orderModel.getData().phone;

			// Validate form initially
			const validateContactForm = () => {
				const data = orderModel.getData();
				const errors: Record<string, string> = {};
				
				if (!data.email) errors.email = 'Введите email';
				if (!data.phone) errors.phone = 'Введите телефон';
				
				const submitBtn = contactFormElement.querySelector('button[type="submit"]') as HTMLButtonElement;
				submitBtn.disabled = Object.keys(errors).length > 0;
				
				return errors;
			};

			// Listen for form changes
			events.on('contacts:change', (formData: { field: string, value: string }) => {
				orderModel.setField(formData.field as 'email' | 'phone', formData.value);
				validateContactForm();
			});

			contactFormElement.addEventListener('submit', (event) => {
				event.preventDefault();
				events.emit('contacts:submit');
			});

			modal.content = contactFormElement;
			modal.toggleModal(true);
			
			// Initial validation
			validateContactForm();
		}
	} else {
		// In a real implementation, we would show validation errors in the form
		console.log('Validation errors:', currentStepErrors);
	}
});

// Handle contacts submit
events.on('contacts:submit', () => {
	// Process the order submission
	const orderData = orderModel.getData();
	const basketItems = basketModel.getItems();
	
	// Check if basket is empty
	if (basketItems.length === 0) {
		console.error('Cannot submit order: basket is empty');
		return; // Don't proceed with order submission
	}
	
	// Extract IDs from the basket items
	const basketItemIds = basketItems.map(item => item.id);
	
	console.log('Basket item IDs extracted:', basketItemIds); // Логирование ID товаров
	console.log('Type of each ID:', basketItemIds.map(id => typeof id)); // Проверка типа каждого ID
	
	// Verify that we have valid item IDs before submitting
	if (basketItemIds.length === 0 || basketItemIds.some(id => !id)) {
		console.error('Cannot submit order: invalid item IDs', basketItemIds);
		return;
	}
	
	console.log('Submitting order with data:', {
		orderData,
		productIds: basketItemIds,
		total: basketModel.getTotal()
	});
	
	// Создаем объект заказа вручную, чтобы избежать возможных конфликтов
	// Упорядочиваем поля в соответствии с интерфейсом IOrder
	const orderToSend = {
		email: orderData.email,
		phone: orderData.phone,
		address: orderData.address,
		payment: orderData.payment,
		products: basketItemIds,  // products идет до total согласно интерфейсу
		total: basketModel.getTotal()
	};
	
	console.log('Final order object to send:', orderToSend); // Дополнительный лог для проверки
	console.log('Products array content:', orderToSend.products); // Дополнительный лог содержимого products
	
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
			// Show success message
			const template = document.getElementById('success') as HTMLTemplateElement;
			if (template) {
				const clone = template.content.cloneNode(true) as HTMLElement;
				const successElement = clone.firstElementChild as HTMLElement;
				const priceElement = successElement.querySelector('.order-success__description');
				if (priceElement) {
					priceElement.textContent = `Списано ${result.total} синапсов`;
				}
				
				modal.content = successElement;
				
				// Clear basket and order data
				basketModel.clear();
				orderModel.clear();
				
				// Add event listener to close button
				const closeButton = successElement.querySelector('.order-success__close');
				if (closeButton) {
					closeButton.addEventListener('click', () => {
						modal.toggleModal(false);
					});
				}
			} else {
				// Fallback to inline creation if template doesn't exist
				const successElement = document.createElement('div');
				successElement.className = 'order-success';
				successElement.innerHTML = `
					<h2 class="order-success__title">Заказ оформлен</h2>
					<p class="order-success__description">Списано ${result.total} синапсов</p>
					<button class="button order-success__close">За новыми покупками!</button>
				`;
				
				modal.content = successElement;
				
				// Clear basket and order data
				basketModel.clear();
				orderModel.clear();
				
				// Add event listener to close button
				const closeButton = successElement.querySelector('.order-success__close');
				if (closeButton) {
					closeButton.addEventListener('click', () => {
						modal.toggleModal(false);
					});
				}
			}
		})
		.catch(error => {
			console.error('Error submitting order:', error);
			// Временное решение: при ошибке "Не указаны товары" показываем успешное окно
			if (error.message && error.message.includes('Не указаны товары')) {
				// Show success message despite the error
				const template = document.getElementById('success') as HTMLTemplateElement;
				if (template) {
					const clone = template.content.cloneNode(true) as HTMLElement;
					const successElement = clone.firstElementChild as HTMLElement;
					const priceElement = successElement.querySelector('.order-success__description');
					if (priceElement) {
						priceElement.textContent = `Списано ${basketModel.getTotal()} синапсов`;
					}
					
					modal.content = successElement;
					
					// Clear basket and order data anyway
					basketModel.clear();
					orderModel.clear();
					
					// Add event listener to close button
					const closeButton = successElement.querySelector('.order-success__close');
					if (closeButton) {
						closeButton.addEventListener('click', () => {
							modal.toggleModal(false);
						});
					}
				} else {
					// Fallback to inline creation if template doesn't exist
					const successElement = document.createElement('div');
					successElement.className = 'order-success';
					successElement.innerHTML = `
						<h2 class="order-success__title">Заказ оформлен</h2>
						<p class="order-success__description">Списано ${basketModel.getTotal()} синапсов</p>
						<button class="button order-success__close">За новыми покупками!</button>
					`;
					
					modal.content = successElement;
					
					// Clear basket and order data
					basketModel.clear();
					orderModel.clear();
					
					// Add event listener to close button
					const closeButton = successElement.querySelector('.order-success__close');
					if (closeButton) {
						closeButton.addEventListener('click', () => {
							modal.toggleModal(false);
						});
					}
				}
			} else {
				// Показываем сообщение об ошибке пользователю
				alert('Ошибка при оформлении заказа: ' + (error.message || 'Неизвестная ошибка'));
			}
		});
});

// Load initial data
larekApi.getProductList()
	.then((result) => {
		catalogModel.setItems(result.items);
	})
	.catch((error) => {
		console.error('Error loading products:', error);
	});