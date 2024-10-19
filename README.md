
---

# E-commerce Backend API

This project serves as the backend for an e-commerce platform, handling users, products, orders, and cart functionalities through a RESTful API. The core technologies used are **Node.js**, **Next.js** (API routes), **Mongoose** for MongoDB interactions, and **TypeScript** for type safety.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Environment Setup](#environment-setup)
3. [Database Seeder](#database-seeder)
4. [API Routes](#api-routes)
    - [Products API](#products-api)
    - [Users API](#users-api)
    - [Cart API](#cart-api)
    - [Orders API](#orders-api)
5. [Database Models](#database-models)
6. [Handlers](#handlers)
7. [Code Explanation](#code-explanation)

---

## Project Structure

```plaintext
├── db/
│   └── seeder.ts              # Seeds the database with initial data
├── src/
│   ├── app/
│   │   └── api/                # API routes
│   │       ├── products/       # Product-related APIs
│   │       ├── users/          # User-related APIs
│   │       └── cart/           # Cart-related APIs
│   │       └── orders/         # Order-related APIs
│   └── lib/
│       ├── handlers.ts         # Common handlers for DB operations
│       └── mongoose.ts         # Mongoose connection logic
├── models/
│   ├── Order.ts                # Order model schema
│   ├── Product.ts              # Product model schema
│   └── User.ts                 # User model schema
└── .env.local                  # Local environment variables
```

## Environment Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or later)
- MongoDB
- A `.env.local` file with the following variables:

```bash
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

### Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

## Database Seeder

You can populate the database with some initial data using the seeder script.

- **File:** `db/seeder.ts`
- **Dependencies:** Mongoose, dotenv, and the User, Product models.

### Running the Seeder

```bash
npx ts-node db/seeder.ts
```

This script will:

- Connect to MongoDB.
- Seed initial products.
- Create a test user with cart items.

---

## API Routes

### Products API

1. **Get All Products**

   - **Route:** `GET /api/products`
   - **Description:** Retrieves all available products.
   - **Relevant Code:** `src/app/api/products/route.ts`

2. **Get Product by ID**

   - **Route:** `GET /api/products/[productId]`
   - **Description:** Retrieves a single product by its ID.
   - **Relevant Code:** `src/app/api/products/[productId]/route.ts`

### Users API

1. **Create User**

   - **Route:** `POST /api/users`
   - **Description:** Creates a new user.
   - **Relevant Code:** `src/app/api/users/route.ts`

2. **Get User Info**

   - **Route:** `GET /api/users/[userId]`
   - **Description:** Retrieves a user's details by their ID.
   - **Relevant Code:** `src/app/api/users/[userId]/route.ts`

### Cart API

1. **Get User Cart**

   - **Route:** `GET /api/users/[userId]/cart`
   - **Description:** Retrieves a user's cart.
   - **Relevant Code:** `src/app/api/users/[userId]/cart/route.ts`

2. **Add Product to Cart**

   - **Route:** `POST /api/users/[userId]/cart`
   - **Description:** Adds a product to the user's cart.
   - **Relevant Code:** `src/app/api/users/[userId]/cart/route.ts`

3. **Update Cart Item**

   - **Route:** `PUT /api/users/[userId]/cart/[productId]`
   - **Description:** Updates the quantity of a product in the user's cart.
   - **Relevant Code:** `src/app/api/users/[userId]/cart/[productId]/route.ts`

4. **Delete Cart Item**

   - **Route:** `DELETE /api/users/[userId]/cart/[productId]`
   - **Description:** Removes a product from the user's cart.
   - **Relevant Code:** `src/app/api/users/[userId]/cart/[productId]/route.ts`

### Orders API

1. **Create Order**

   - **Route:** `POST /api/users/[userId]/orders`
   - **Description:** Creates an order from the user's cart.
   - **Relevant Code:** `src/app/api/users/[userId]/orders/route.ts`

2. **Get User Orders**

   - **Route:** `GET /api/users/[userId]/orders`
   - **Description:** Retrieves a user's orders.
   - **Relevant Code:** `src/app/api/users/[userId]/orders/route.ts`

3. **Get Order by ID**

   - **Route:** `GET /api/users/[userId]/orders/[orderId]`
   - **Description:** Retrieves a specific order by its ID.
   - **Relevant Code:** `src/app/api/users/[userId]/orders/[orderId]/route.ts`

---

## Database Models

### Product Model

- **File:** `src/models/Product.ts`
- **Fields:**
  - `name`: Name of the product.
  - `price`: Price of the product.
  - `img`: Optional image URL.
  - `description`: Optional product description.

### User Model

- **File:** `src/models/User.ts`
- **Fields:**
  - `email`: User's email (unique).
  - `password`: User's password.
  - `cartItems`: Array of cart items.
  - `orders`: Array of order references.

### Order Model

- **File:** `src/models/Order.ts`
- **Fields:**
  - `userId`: Reference to the user.
  - `orderItems`: Array of products in the order.
  - `address`: Delivery address.
  - `cardHolder`: Name on the card.
  - `cardNumber`: Card number used for payment.

---

## Handlers

Handlers for database operations are located in the `src/lib/handlers.ts` file. These functions are responsible for CRUD operations and contain the logic for interacting with the MongoDB database.

---

## Code Explanation

### 1. `db/seeder.ts`

This file is responsible for seeding the database with initial data, including product and user information. The steps are as follows:

- It first imports the necessary modules (Order, Product, User models, dotenv for environment variables, and mongoose for MongoDB connection).
- The `MONGODB_URI` is fetched from environment variables.
- **Products** are defined as an array of objects, each containing `name`, `price`, `img`, and `description`.
- It then connects to the MongoDB database, drops any existing data, and inserts the products.
- A **User** is created with specific cart items (containing the newly inserted products) and saved to the database.
- After the process, the database connection is closed.

### 2. `src/app/api/products/[productId]/route.ts`

This file handles fetching a specific product by its ID. Key steps include:

- The product ID is validated using Mongoose's `Types.ObjectId.isValid()`.
- If the product exists, it's retrieved from the database using the `getProductById()` handler.
- If the product is not found or the ID is invalid, appropriate error messages are returned.

### 3. `src/app/api/users/[userId]/cart/[productId]/route.ts`

This file handles two key operations for cart items:

1. **PUT Request** (Update Cart Item):
   - Validates both the `userId` and `productId`.
   - Updates the quantity of the product in the user's cart.
   - If the product doesn't exist in the cart, it's added.
   - The updated cart is returned in the response.

2. **DELETE Request** (Remove Cart Item):
   - Validates both the `userId` and `productId`.
   - Finds the user and removes the product from the cart.
   - Returns the updated cart.

### 4. `src/lib/handlers.ts`

This file contains common database handlers for various operations:

- **`getProducts()`**: Fetches all products from the database and returns them.
- **`createUser()`**: Creates a new user if the email does not already exist in the database.
- **`getUserCart()`**: Retrieves the cart of a specific user by their ID.
- **`AddProductToCart()`**: Adds a product to the user's cart or updates its quantity if it already exists.
- **`createOrder()`**: Creates a new order for the user based on their current cart items, empties the cart afterward.
- **`getOrder()`**: Fetches a specific order by user ID and order ID.

---
