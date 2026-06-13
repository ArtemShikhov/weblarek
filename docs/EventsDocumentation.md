# Events Documentation

This document describes all events generated in the WebLarek application, organized by the layer where they are generated.

## Events Generated in Model Layer

### Catalog Model
- **catalog:changed** - Generated when the product catalog is updated
  - Triggered by: Setting new items array in the catalog
  - Data: `{ items: IProduct[] }`

### Selected Item Model
- **item:selected** - Generated when a product is selected for preview
  - Triggered by: Setting the selected item in the model
  - Data: `{ item: IProduct }`

### Basket Model
- **basket:changed** - Generated when the basket contents change
  - Triggered by: Adding/removing items from the basket
  - Data: `{ items: IProduct[], total: number, count: number }`

### Order Model
- **order:changed** - Generated when order data is updated
  - Triggered by: Setting fields in the order model
  - Data: `{ order: IOrder }`

- **order:valid** - Generated when order validation passes
  - Triggered by: Successful validation of order data
  - Data: `{ isValid: boolean }`

- **order:invalid** - Generated when order validation fails
  - Triggered by: Failed validation of order data
  - Data: `{ errors: BuyerErrors }`

## Events Generated in View Layer

### Product Card
- **product:select** - Generated when a product card is clicked
  - Triggered by: Clicking the buy button on a product card
  - Data: `{ id: string }`

### Preview Card
- **preview:buy** - Generated when buy button is clicked in preview
  - Triggered by: Clicking the buy button in the preview modal
  - Data: `{ id: string }`

- **preview:remove** - Generated when remove button is clicked in preview
  - Triggered by: Clicking the remove button in the preview modal
  - Data: `{ id: string }`

### Basket Item
- **basket:remove** - Generated when delete button is clicked on a basket item
  - Triggered by: Clicking the delete button on a basket item
  - Data: `{ id: string }`

### Basket View
- **order:open** - Generated when the order button is clicked in the basket
  - Triggered by: Clicking the "Оформить заказ" button in the basket
  - Data: None

### Order Form
- **order:payment:changed** - Generated when payment method is changed
  - Triggered by: Changing the selected payment method
  - Data: `{ payment: TPayment }`

- **order:change** - Generated when any field in the order form changes
  - Triggered by: Changing any input field in the order form
  - Data: `{ field: keyof IOrder, value: string }`

### Contacts Form
- **contacts:submit** - Generated when the contacts form is submitted
  - Triggered by: Submitting the contacts form
  - Data: None

- **contacts:change** - Generated when any field in the contacts form changes
  - Triggered by: Changing any input field in the contacts form
  - Data: `{ field: keyof IBuyer, value: string }`

### Modal
- **modal:close** - Generated when the modal is closed
  - Triggered by: Clicking the close button, clicking overlay, or pressing Escape
  - Data: None