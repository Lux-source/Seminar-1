import Products, { Product } from '@/models/Product';
import Users, { User, CartItem } from '@/models/User';
import Orders, {OrderItem, Order} from '@/models/Order'
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt'

export interface PopulatedOrder extends Order {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Ensure userId is typed correctly
  orderItems: (OrderItem & { product: Types.ObjectId })[]; // Adjust if populated
}

export interface GetOrdersResponse {
  orders: PopulatedOrder[];
}

export async function getOrders(): Promise<GetOrdersResponse> {
  await connect();

  const orders = await Orders.find()
    .populate('user')
    .populate({
      path: 'orderItems.product',
      select: 'name price img description',
    });

  const transformedOrders = orders.map((order) => ({
    _id: order._id,
    userId: order.userId,
    orderItems: order.orderItems.map((item) => ({
      product: item.product,
      qty: item.qty,
      price: item.price,
    })),
    address: order.address,
    date: order.date,
    cardHolder: order.cardHolder,
    cardNumber: order.cardNumber,
  })) as PopulatedOrder[];

  return { orders: transformedOrders };
}


export interface GetProductsResponse {
  products: (Product | { _id: Types.ObjectId })[]
}

export async function getProducts(): Promise<GetProductsResponse> {
  await connect()

  const productsProjection = {
    __v: false
  }
  const products = await Products.find({}, productsProjection)

  return {
    products,
  }
}

export interface ErrorResponse {
  error: string
  message: string
}

export interface CreateUserResponse {
  _id: Types.ObjectId
}

export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();

  const prevUser = await Users.find({ email: user.email });

  if (prevUser.length !== 0) {
    return null;
  }
  const hash = await bcrypt.hash(user.password, 10)
  const doc: User = {
    ...user,
    password: hash,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);

  return {
    _id: newUser._id,
  };
}

export interface GetUserResponse
  extends Pick<User, 'email' | 'name' | 'surname' | 'address' | 'birthdate'> {
  _id: Types.ObjectId
}

export async function getUser(
  userId: Types.ObjectId | string
): Promise<GetUserResponse | null> {
  await connect()

  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  }
  const user = await Users.findById(userId, userProjection)

  return user
}

export interface GetUserCartResponse {
  cartItems: (Omit<CartItem, 'product'> & {
    product: Product;
  })[];
}

export async function getUserCart(
  userId: Types.ObjectId | string
): Promise<GetUserCartResponse | null> {
  await connect();

  const user = await Users.findById(userId).populate<{
    cartItems: {
      product: Product;
      qty: number;
    }[];
  }>('cartItems.product');

  if (!user) {
    return null;
  }

  return { cartItems: user.cartItems };
}

export interface AddProductToCartResponse {
  cartItems: CartItem[];
}

export async function AddProductToCart(
  userId: Types.ObjectId | string, 
  productId: Types.ObjectId | string,
  qty: number
): Promise<AddProductToCartResponse | null>{
  await connect();

  const user = await Users.findById(userId);
  if (!user){
    return null;
  }

  const productExists = await Products.exists({
    _id: productId
  });
  
  if(!productExists){
    return null;
  }

  const existingCartItemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId.toString()
  );


  if (existingCartItemIndex !== -1){
    user.cartItems[existingCartItemIndex].qty += qty;
  } else {
    user.cartItems.push({
      product: new Types.ObjectId(productId),
      qty: qty,
    });
  }

  await user.save();

  return { cartItems: user.cartItems};

}


export interface OrderData{
  address: string;
  cardHolder: string;
  cardNumber: string;
}

export interface CreateOrderResponse{
  orderId: Types.ObjectId;
}

export async function createOrder(
  userId: Types.ObjectId | string,
  orderData: OrderData
): Promise<CreateOrderResponse | null> {
  await connect();

  // Use a typed populate to define the structure of cartItems after population
  const user = await Users.findById(userId).populate<{
    cartItems: { product: Product; qty: number }[];
  }>('cartItems.product');

  // Check if user exists and cart is not empty
  if (!user || user.cartItems.length === 0) {
    return null;
  }

  // Transform cart items into order items with price
  const orderItems: OrderItem[] = user.cartItems.map((cartItem) => ({
    product: (cartItem.product as Product & { _id: Types.ObjectId })._id, // Cast product to include _id
    qty: cartItem.qty,
    price: (cartItem.product as Product & { _id: Types.ObjectId }).price, // Cast for TypeScript safety
  }));

  // Create a new order
  const newOrder = await Orders.create({
    userId: user._id,
    orderItems: orderItems,
    address: orderData.address,
    date: new Date(),
    cardHolder: orderData.cardHolder,
    cardNumber: orderData.cardNumber,
  });

  // Clear user's cart and save the order reference
  user.cartItems = [];
  user.orders.push(newOrder._id);
  await user.save();

  return { orderId: newOrder._id };
}


export interface GetOrderResponse extends Order {
  _id: Types.ObjectId;
}

export async function getOrder(
  userId: Types.ObjectId | string,
  orderId: Types.ObjectId | string
): Promise<GetOrderResponse | null> {
  await connect();

  const order = await Orders.findOne({
    _id: orderId,
    userId: userId,
  }).populate({
    path: 'orderItems.product',
    select: 'name price img description',
  });

  return order;
}

export async function getOrderById(
  orderId: Types.ObjectId | string
): Promise<GetOrderResponse | null> {
  await connect();

  const order = await Orders.findById(orderId).populate({
    path: 'orderItems.product',
    select: 'name price img description',
  });

  return order;
}

export interface GetUserOrdersResponse {
  orders: {
    _id: Types.ObjectId;
    address: string;
    date: Date;
    cardHolder: string;
    cardNumber: string;
    orderItems: OrderItem[];
  }[];
}

export async function getUserOrders(
  userId: Types.ObjectId | string
): Promise<GetUserOrdersResponse | null> {
  await connect();

  const user = await Users.findById(userId).populate<{
    orders: {
      _id: Types.ObjectId;
      address: string;
      date: Date;
      cardHolder: string;
      cardNumber: string;
      orderItems: OrderItem[];
    }[];
  }>('orders');

  if (!user) {
    return null;
  }

  return { orders: user.orders}; 
}

export interface UpdateCartItemResponse extends GetUserCartResponse {
  newItem?: boolean;
}

export async function updateCartItem(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string,
  qty: number
): Promise<UpdateCartItemResponse | null> {
  await connect();

  const user = await Users.findById(userId);

  if (!user) {
    return null;
  }

  const productExists = await Products.exists({ _id: productId });

  if (!productExists) {
    return null;
  }

  const existingCartItemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  let newItem = false;

  if (existingCartItemIndex !== -1) {
    user.cartItems[existingCartItemIndex].qty = qty;
  } else {
    user.cartItems.push({
      product: new Types.ObjectId(productId),
      qty: qty,
    });
    newItem = true;
  }

  await user.save();

  // Populate cart items
  await user.populate({
    path: 'cartItems.product',
    select: 'name price img description',
  });

  return { cartItems: user.cartItems as unknown as GetUserCartResponse['cartItems'], newItem };
}

export async function deleteCartItem(
  userId: Types.ObjectId | string,
  productId: Types.ObjectId | string
): Promise<GetUserCartResponse | null> {
  await connect();

  const user = await Users.findById(userId);

  if (!user) {
    return null;
  }

  user.cartItems = user.cartItems.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await user.save();

  // Populate cart items
  await user.populate({
    path: 'cartItems.product',
    select: 'name price img description',
  });

  return { cartItems: user.cartItems as unknown as GetUserCartResponse['cartItems'] };
}

export interface GetProductResponse extends Product {
  _id: Types.ObjectId;
}

export async function getProductById(
  productId: Types.ObjectId | string
): Promise<GetProductResponse | null> {
  await connect();

  const product = await Products.findById(productId, '-__v');

  return product;
}

// Seminar 2 checkcredentials logic
export interface CheckCredentialsResponse {
  _id: Types.ObjectId
}

export async function checkCredentials(
  email: string,
  password: string
): Promise<CheckCredentialsResponse | null> {

  // Implement this...
  
  await connect();

  const user = await Users.findOne({ email });

  if (!user){
    return null;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match){
    return null;
  }

  return { _id: user._id };

  // No maneajaba sin usar el compare, porque no comparaba correctamente el plain text, con la hasheada dentro
  /*const user = await Users.findOne({email})

  if(user === null || !(await bcrypt.hash(user.password, 10))){ // Revisar si cuadra con gabriel
                                          // Realmente solo ve si hay un hash, comprueba con la password param?
    return null;
  }

  return { _id: user._id };
  */
}