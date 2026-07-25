# API Reference

## Items API (`/api/items`)

### 1. Add Item
* **HTTP Method:** `POST`
* **Endpoint:** `/api/items`
* **Function:** `addItem`
* **Description:** Adds a new item to the store inventory.
* **Request Body:**
  ```json
  {
    "name": "Item Name",
    "sku": "SKU123",
    "price": 19.99
  }
  ```

### 2. Get All Items
* **HTTP Method:** `GET`
* **Endpoint:** `/api/items`
* **Function:** `getItems`
* **Description:** Retrieves all items available in the store inventory.

### 3. Get Item by ID or SKU
* **HTTP Method:** `GET`
* **Endpoint:** `/api/items/:identifier`
* **Function:** `getItemByIdOrSku`
* **Description:** Retrieves a specific item using its Mongo `_id` or `sku`.

### 4. Edit Item
* **HTTP Method:** `PUT`
* **Endpoint:** `/api/items/:identifier`
* **Function:** `editItem`
* **Description:** Updates the details (name, sku, price) of an existing item identified by `_id` or `sku`.
* **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "sku": "NEW_SKU",
    "price": 24.99
  }
  ```

### 5. Delete Item
* **HTTP Method:** `DELETE`
* **Endpoint:** `/api/items/:identifier`
* **Function:** `removeItem`
* **Description:** Deletes an item from the store inventory identified by `_id` or `sku`.

---

## Cart API (`/api/carts`)

### 1. Create Cart
* **HTTP Method:** `POST`
* **Endpoint:** `/api/carts`
* **Function:** `createCart`
* **Description:** Creates a new shopping cart with a customer name and an optional custom cart ID.
* **Request Body:**
  ```json
  {
    "customerName": "John Doe",
    "id": "cart_123"
  }
  ```

### 2. Get Cart Details
* **HTTP Method:** `GET`
* **Endpoint:** `/api/carts/:id`
* **Function:** `getCart`
* **Description:** Retrieves cart information along with detailed item breakdown and total balance.

### 3. Add Item to Cart
* **HTTP Method:** `POST`
* **Endpoint:** `/api/carts/:id/items`
* **Function:** `addItemToCart`
* **Description:** Adds a specified quantity of an item (by SKU) to the cart.
* **Request Body:**
  ```json
  {
    "sku": "SKU123",
    "qty": 2
  }
  ```

### 4. Get Cart Balance
* **HTTP Method:** `GET`
* **Endpoint:** `/api/carts/:id/balance`
* **Function:** `getCartBalance`
* **Description:** Calculates and returns the item breakdown and total cost balance for the specified cart.

### 5. Checkout
* **HTTP Method:** `POST`
* **Endpoint:** `/api/carts/:id/checkout`
* **Function:** `checkout`
* **Description:** Performs checkout for the cart and generates a text-formatted receipt file.
