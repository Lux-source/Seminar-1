---

# E-commerce Backend API

This project serves as the backend for an e-commerce platform, handling users, products, orders, and cart functionalities through a RESTful API. The core technologies used are **Node.js**, **Next.js** (API routes), **Mongoose** for MongoDB interactions, and **TypeScript** for type safety.

The project implements authentication and authorization mechanisms to ensure secure access to user-specific resources.

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
7. [Code Explanation](#code-explanation)
8. [Testing the API](#testing-the-api)
9. [Conclusion](#conclusion)

---

## Project Structure

```plaintext
├── db/
│   └── seeder.ts              # Seeds the database with initial data
├── src/
│   ├── app/
│   │   └── api/                # API routes
│   │       ├── auth/           # Authentication routes
│   │       │   ├── signin/
│   │       │   │   └── route.ts
│   │       │   └── signout/
│   │       │       └── route.ts
│   │       ├── products/       # Product-related APIs
│   │       │   └── [productId]/route.ts
│   │       │   └── route.ts
│   │       ├── users/          # User-related APIs
│   │       │   ├── [userId]/route.ts
│   │       │   ├── [userId]/cart/
│   │       │   │   ├── [productId]/route.ts
│   │       │   │   └── route.ts
│   │       │   ├── [userId]/orders/
│   │       │   │   ├── [orderId]/route.ts
│   │       │   │   └── route.ts
│   │       └── users/route.ts
│   └── lib/
│       ├── auth.ts             # Authentication utility functions
│       ├── handlers.ts         # Common handlers for DB operations
│       └── mongoose.ts         # Mongoose connection logic
├── src/
│   └── models/
│       ├── Order.ts            # Order model schema
│       ├── Product.ts          # Product model schema
│       └── User.ts             # User model schema
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
SESSION_SECRET=YourSuperSecretKey
```

### Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

## Database Seeder

You can populate the database with some initial data using the seeder script.

- **File:** `db/seeder.ts`
- **Dependencies:** Mongoose, dotenv, bcrypt, and the User, Product models.

### Running the Seeder

```bash
npx ts-node db/seeder.ts
```

This script will:

- Connect to MongoDB.
- Seed initial products.
- Create a test user with hashed passwords and cart items.

### Password Hashing

- The seeder uses `bcrypt` to hash user passwords before saving them to the database.
- You can verify that passwords are hashed by checking the user documents in MongoDB Compass or another MongoDB client.

---

## API Routes

### Authentication API

1. **Sign In**

   - **Route:** `POST /api/auth/signin`
   - **Description:** Authenticates a user and creates a session.
   - **Request Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "userpassword"
     }
     ```
   - **Response:** Returns user ID and sets a session cookie.
   - **Relevant Code:** `src/app/api/auth/signin/route.ts`

2. **Sign Out**

   - **Route:** `POST /api/auth/signout`
   - **Description:** Logs out the user by deleting the session cookie.
   - **Relevant Code:** `src/app/api/auth/signout/route.ts`

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
   - **Description:** Creates a new user with hashed password.
   - **Request Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "userpassword",
       "name": "John",
       "surname": "Doe",
       "address": "123 Main St",
       "birthdate": "1990-01-01"
     }
     ```
   - **Relevant Code:** `src/app/api/users/route.ts`

2. **Get User Info**

   - **Route:** `GET /api/users/[userId]`
   - **Description:** Retrieves a user's details by their ID.
   - **Authentication:** Required.
   - **Authorization:** User can only access their own information.
   - **Relevant Code:** `src/app/api/users/[userId]/route.ts`

### Cart API

1. **Get User Cart**

   - **Route:** `GET /api/users/[userId]/cart`
   - **Description:** Retrieves a user's cart.
   - **Authentication:** Required.
   - **Authorization:** User can only access their own cart.
   - **Relevant Code:** `src/app/api/users/[userId]/cart/route.ts`

2. **Add Product to Cart**

   - **Route:** `POST /api/users/[userId]/cart`
   - **Description:** Adds a product to the user's cart.
   - **Authentication:** Required.
   - **Authorization:** User can only modify their own cart.
   - **Request Body:**
     ```json
     {
       "productId": "productId",
       "qty": 1
     }
     ```
   - **Relevant Code:** `src/app/api/users/[userId]/cart/route.ts`

3. **Update Cart Item**

   - **Route:** `PUT /api/users/[userId]/cart/[productId]`
   - **Description:** Updates the quantity of a product in the user's cart.
   - **Authentication:** Required.
   - **Authorization:** User can only modify their own cart.
   - **Request Body:**
     ```json
     {
       "qty": 2
     }
     ```
   - **Relevant Code:** `src/app/api/users/[userId]/cart/[productId]/route.ts`

4. **Delete Cart Item**

   - **Route:** `DELETE /api/users/[userId]/cart/[productId]`
   - **Description:** Removes a product from the user's cart.
   - **Authentication:** Required.
   - **Authorization:** User can only modify their own cart.
   - **Relevant Code:** `src/app/api/users/[userId]/cart/[productId]/route.ts`

### Orders API

1. **Create Order**

   - **Route:** `POST /api/users/[userId]/orders`
   - **Description:** Creates an order from the user's cart.
   - **Authentication:** Required.
   - **Authorization:** User can only create orders for themselves.
   - **Request Body:**
     ```json
     {
       "address": "123 Main St",
       "cardHolder": "John Doe",
       "cardNumber": "1234567812345678"
     }
     ```
   - **Relevant Code:** `src/app/api/users/[userId]/orders/route.ts`

2. **Get User Orders**

   - **Route:** `GET /api/users/[userId]/orders`
   - **Description:** Retrieves a user's orders.
   - **Authentication:** Required.
   - **Authorization:** User can only access their own orders.
   - **Relevant Code:** `src/app/api/users/[userId]/orders/route.ts`

3. **Get Order by ID**

   - **Route:** `GET /api/users/[userId]/orders/[orderId]`
   - **Description:** Retrieves a specific order by its ID.
   - **Authentication:** Required.
   - **Authorization:** User can only access their own orders.
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
  - `password`: User's hashed password.
  - `name`: User's first name.
  - `surname`: User's last name.
  - `address`: User's address.
  - `birthdate`: User's birthdate.
  - `cartItems`: Array of cart items.
  - `orders`: Array of order references.

### Order Model

- **File:** `src/models/Order.ts`
- **Fields:**
  - `userId`: Reference to the user.
  - `orderItems`: Array of products in the order.
  - `address`: Delivery address.
  - `date`: Date of the order.
  - `cardHolder`: Name on the card.
  - `cardNumber`: Card number used for payment.

---

## Handlers

Handlers for database operations are located in the `src/lib/handlers.ts` file. These functions are responsible for CRUD operations and contain the logic for interacting with the MongoDB database.

Key handlers include:

- **Authentication Handlers:**
  - `checkCredentials()`: Validates user credentials during sign-in.
- **User Handlers:**
  - `createUser()`: Creates a new user with hashed password.
  - `getUser()`: Retrieves user information.
- **Cart Handlers:**
  - `getUserCart()`: Retrieves a user's cart.
  - `AddProductToCart()`: Adds a product to a user's cart.
  - `updateCartItem()`: Updates the quantity of a cart item.
  - `deleteCartItem()`: Removes a product from a user's cart.
- **Order Handlers:**
  - `createOrder()`: Creates an order from the user's cart.
  - `getOrder()`: Retrieves a specific order.
  - `getUserOrders()`: Retrieves all orders for a user.
- **Product Handlers:**
  - `getProducts()`: Retrieves all products.
  - `getProductById()`: Retrieves a product by its ID.

---

## Code Explanation

### 1. `db/seeder.ts`

This file is responsible for seeding the database with initial data, including product and user information. Key points:

- **Password Hashing:** Uses `bcrypt` to hash user passwords before saving them.
- **Products:** Defines an array of products to insert into the database.
- **User Creation:** Creates a test user with a hashed password and cart items.

### 2. `src/app/api/auth/signin/route.ts`

This file handles user authentication during sign-in:

- **Request Handling:** Expects `email` and `password` in the request body.
- **Credential Checking:** Uses `checkCredentials()` handler to validate credentials.
- **Session Creation:** If credentials are valid, creates a session using JWT and sets a session cookie.
- **Error Handling:** Returns appropriate error messages for missing parameters or invalid credentials.

### 3. `src/lib/auth.ts`

Contains utility functions for authentication using JWT:

- **`encode()`:** Generates a JWT token with user payload.
- **`decode()`:** Verifies and decodes a JWT token.
- **`createSession()`:** Creates a session by setting a cookie with the JWT token.
- **`getSession()`:** Retrieves and decodes the session from the cookie.
- **`deleteSession()`:** Deletes the session cookie to log out the user.

### 4. Authentication and Authorization in API Routes

#### **Authentication Flow:**

- **Authentication Check:** Each protected route calls `getSession()` to check if the user is authenticated.
- **Authorization Check:** Compares `session.userId` with the `userId` from the route parameters to ensure the user is authorized to access or modify the resource.
- **Error Responses:**
  - `401 Unauthorized`: If the user is not authenticated.
  - `403 Forbidden`: If the user is authenticated but not authorized to access the resource.

#### **Example in `/api/users/[userId]/cart/route.ts`:**

```typescript
// Authentication
const session = await getSession();
if (!session?.userId){
  return NextResponse.json(
    {
      error: 'NOT_AUTHENTICATED',
      message: 'Authentication required.',
    },
    { status: 401 }
  );
}

// Authorization
if(session.userId.toString() !== userId){
  return NextResponse.json(
    {
      error: 'NOT_AUTHORIZED',
      message: 'Unauthorized access.',
    },
    { status: 403 }
  );
}
```

### 5. Password Hashing and Credential Verification

- **User Registration:** When creating a user, passwords are hashed using `bcrypt` before being stored.
- **User Sign-In:** During sign-in, the provided password is compared with the hashed password using `bcrypt.compare()`.

#### **`checkCredentials()` in `src/lib/handlers.ts`:**

```typescript
export async function checkCredentials(
  email: string,
  password: string
): Promise<CheckCredentialsResponse | null> {
  await connect();

  const user = await Users.findOne({ email });

  if (!user) {
    return null;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return null;
  }

  return { _id: user._id };
}
```

### 6. Modified API Routes with Authentication and Authorization

#### **a. `/api/users/[userId]/cart/route.ts`**

- **Purpose:** Handles getting and adding items to a user's cart.
- **Modifications:**
  - Added authentication and authorization checks using `getSession()`.
  - Ensures only authenticated users can access their own cart.

#### **b. `/api/users/[userId]/cart/[productId]/route.ts`**

- **Purpose:** Handles updating and deleting specific cart items.
- **Modifications:**
  - Added authentication and authorization checks.
  - Validates user ID and product ID.
  - Ensures users can only modify their own cart items.

#### **c. `/api/users/[userId]/orders/route.ts`**

- **Purpose:** Handles creating new orders and retrieving a user's orders.
- **Modifications:**
  - Added authentication and authorization checks.
  - Validates user ID.
  - Ensures users can only create orders for themselves and view their own orders.

#### **d. `/api/users/[userId]/orders/[orderId]/route.ts`**

- **Purpose:** Retrieves a specific order for a user.
- **Modifications:**
  - Added authentication and authorization checks.
  - Validates user ID and order ID.
  - Ensures users can only access their own orders.

### 7. Error Handling and Response Consistency

- **Error Responses:** All error responses follow a consistent format with an `error` code and a `message`.
- **HTTP Status Codes:** Appropriate HTTP status codes are used for different error scenarios (e.g., 400, 401, 403, 404).
- **Data Validation:** Input data is validated thoroughly to prevent invalid data from causing issues.

---

## Testing the API

To test the API, you can use tools like **Postman** or **cURL**.

### Testing Authentication

1. **Sign In:**
   - **Endpoint:** `POST /api/auth/signin`
   - **Body:**
     ```json
     {
       "email": "johndoe@example.com",
       "password": "1234"
     }
     ```
   - **Expected Result:** Receive `200 OK` and a session cookie.

2. **Access Protected Route Without Authentication:**
   - **Endpoint:** `GET /api/users/[userId]/cart`
   - **Expected Result:** Receive `401 Unauthorized`.

3. **Access Protected Route With Authentication:**
   - Include the session cookie from sign-in.
   - **Endpoint:** `GET /api/users/[userId]/cart`
   - **Expected Result:** Successful response with the user's cart.

4. **Attempt Unauthorized Access:**
   - Try accessing another user's cart using their `userId`.
   - **Expected Result:** Receive `403 Forbidden`.

5. **Sign Out:**
   - **Endpoint:** `POST /api/auth/signout`
   - **Expected Result:** Session cookie is deleted.

### Testing Cart Operations

1. **Add Product to Cart:**
   - **Endpoint:** `POST /api/users/[userId]/cart`
   - **Body:**
     ```json
     {
       "productId": "validProductId",
       "qty": 2
     }
     ```
   - **Expected Result:** Product added to cart.

2. **Update Cart Item:**
   - **Endpoint:** `PUT /api/users/[userId]/cart/[productId]`
   - **Body:**
     ```json
     {
       "qty": 5
     }
     ```
   - **Expected Result:** Quantity updated.

3. **Delete Cart Item:**
   - **Endpoint:** `DELETE /api/users/[userId]/cart/[productId]`
   - **Expected Result:** Product removed from cart.

### Testing Order Operations

1. **Create Order:**
   - **Endpoint:** `POST /api/users/[userId]/orders`
   - **Body:**
     ```json
     {
       "address": "123 Main St",
       "cardHolder": "John Doe",
       "cardNumber": "1234567812345678"
     }
     ```
   - **Expected Result:** Order created, cart emptied.

2. **Get User Orders:**
   - **Endpoint:** `GET /api/users/[userId]/orders`
   - **Expected Result:** List of user's orders.

3. **Get Order by ID:**
   - **Endpoint:** `GET /api/users/[userId]/orders/[orderId]`
   - **Expected Result:** Details of the specific order.

---
