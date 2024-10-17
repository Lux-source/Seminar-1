import Products, { Product } from '@/models/Product';
import Users, { User, CartItem } from '@/models/User';
import Orders, {OrderItem, Order} from '@/models/Order'
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';


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

  const doc: User = {
    ...user,
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
  cartItems: CartItem[];
}

export async function getUserCart(
  userId: Types.ObjectId | string
): Promise<GetUserCartResponse | null>{
  await connect();

  const user = await Users.findById(userId, {cartItems: true}).populate({
    path: 'cartItems.product', 
    select: 'name price img description',
  });


  if (!user){
    return null;
  }

  return {cartItems: user.cartItems};
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
): Promise<CreateOrderResponse | null>{
  await connect();

  const user = await Users.findById(userId).populate({
    path: 'cartItems.product',
    select: 'name price',
  });

  if (!user || user.cartItems.length === 0){
    return null;
  }

 // Transform cart items into order items
  const orderItems: OrderItem[] = user.cartItems.map((cartItem) => ({
    product: cartItem.product._id,
    qty: cartItem.qty,
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


 // Limpio carrito porque la orden ya se hace (asi podemos hacer otra orden nueva con objetos distinos en el carrito) ->
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