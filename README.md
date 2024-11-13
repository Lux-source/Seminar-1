Here's an updated `README.md` for your project, incorporating all the details you shared:

---

# E-commerce Backend API

This project is a backend API for an e-commerce platform, handling user authentication, product management, cart functionalities, and order processing. The project is built with **Next.js**, **MongoDB** using **Mongoose**, and **TypeScript** for type safety, with **bcrypt** for password hashing and **JWT** for session management.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Environment Setup](#environment-setup)
3. [Database Seeder](#database-seeder)
4. [API Routes](#api-routes)
    - [Authentication API](#authentication-api)
    - [Products API](#products-api)
    - [Users API](#users-api)
    - [Cart API](#cart-api)
    - [Orders API](#orders-api)
5. [Database Models](#database-models)
6. [Handlers](#handlers)
7. [Testing the API](#testing-the-api)

---

## Project Structure

```plaintext
├── db/
│   └── seeder.ts                # Seeds the database with initial data
├── public/
│   └── img/                     # Stores static images (logo.svg)
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # Authentication routes
│   │   │   ├── products/        # Product-related APIs
│   │   │   ├── users/           # User-related APIs (with nested cart and orders)
│   │   │   └── users/[userId]/orders/[orderId]/route.ts
│   ├── lib/                     # Helper functions for authentication, database, etc.
│   └── models/                  # Mongoose schemas for Order, Product, and User
├── .env.local                   # Environment variables for MongoDB URI, session secret
├── tailwind.config.ts           # Tailwind CSS configuration
└── README.md                    # Documentation
```

---

## Environment Setup

### Prerequisites

- **Node.js** (v16 or later)
- **MongoDB**

### Environment Variables

In `.env.local`, define the following variables:

```bash
MONGODB_URI=mongodb://localhost:27017/ecommerce
SESSION_SECRET=YourSuperSecretKey
```

### Install Dependencies

```bash
npm install
```

---

## Database Seeder

Use `db/seeder.ts` to populate the database with initial users and products.

1. **Run Seeder**: `npx ts-node db/seeder.ts`
2. **Functionality**:
   - Seeds initial products.
   - Creates test users with hashed passwords.
   - Populates each user’s cart with sample items.

---

## API Routes

### Authentication API

- **Sign In**: `POST /api/auth/signin`  
  Authenticates a user and initiates a session.
  ```json
  { "email": "user@example.com", "password": "userpassword" }
  ```
  
- **Sign Out**: `POST /api/auth/signout`  
  Ends the user session by deleting the session cookie.

### Products API

- **Get All Products**: `GET /api/products`  
  Retrieves a list of all available products.
  
- **Get Product by ID**: `GET /api/products/[productId]`  
  Retrieves details of a product using its ID.

### Users API

- **Create User**: `POST /api/users`  
  Registers a new user with email, password, and basic profile details.
  
- **Get User Info**: `GET /api/users/[userId]`  
  Returns user information (authentication required).

### Cart API

- **Get User Cart**: `GET /api/users/[userId]/cart`  
  Retrieves items in the user’s cart (authentication required).

- **Add Product to Cart**: `POST /api/users/[userId]/cart`  
  Adds an item to the user’s cart.

- **Update Cart Item**: `PUT /api/users/[userId]/cart/[productId]`  
  Modifies the quantity of a specific item in the cart.

- **Delete Cart Item**: `DELETE /api/users/[userId]/cart/[productId]`  
  Removes an item from the user’s cart.

### Orders API

- **Create Order**: `POST /api/users/[userId]/orders`  
  Places an order with items in the user’s cart.

- **Get User Orders**: `GET /api/users/[userId]/orders`  
  Returns all orders for a specific user.

- **Get Order by ID**: `GET /api/users/[userId]/orders/[orderId]`  
  Retrieves a specific order.

---

## Database Models

### Product Model

Defines basic product details:
- **Fields**: `name`, `price`, `img`, `description`

### User Model

Defines user profile, cart, and order references.
- **Fields**: `email`, `password`, `name`, `surname`, `address`, `birthdate`, `cartItems`, `orders`

### Order Model

Stores details of each order.
- **Fields**: `userId`, `orderItems`, `address`, `date`, `cardHolder`, `cardNumber`

---

## Handlers

Located in `src/lib/handlers.ts`, these functions handle database operations.

Key handlers:
- **Authentication**: `checkCredentials`, `createSession`, `getSession`
- **Cart**: `getUserCart`, `AddProductToCart`, `updateCartItem`, `deleteCartItem`
- **Order**: `createOrder`, `getUserOrders`, `getOrder`
- **Product**: `getProducts`, `getProductById`

---

## Testing the API

To test endpoints, use **Postman** or **cURL**.

### Authentication Tests

1. **Sign In**  
   `POST /api/auth/signin`  
   Body: `{ "email": "user@example.com", "password": "password" }`

2. **Access Protected Route**  
   Include session cookie and access a route, e.g., `GET /api/users/[userId]/cart`.

3. **Sign Out**  
   `POST /api/auth/signout`

### Cart Operations

1. **Add Product**  
   `POST /api/users/[userId]/cart`  
   Body: `{ "productId": "validProductId", "qty": 2 }`

2. **Update Cart Item**  
   `PUT /api/users/[userId]/cart/[productId]`  
   Body: `{ "qty": 5 }`

3. **Delete Cart Item**  
   `DELETE /api/users/[userId]/cart/[productId]`

### Order Operations

1. **Create Order**  
   `POST /api/users/[userId]/orders`  
   Body: `{ "address": "123 Main St", "cardHolder": "John Doe", "cardNumber": "1234567812345678" }`

2. **Get User Orders**  
   `GET /api/users/[userId]/orders`

---
