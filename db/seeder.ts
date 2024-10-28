import { Order } from '@/models/Order';
import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

const products: Product[] = [
  {
    name: 'Earthen Bottle',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    description: 'What a bottle!',
  },
  {
    name: 'Nomad Tumbler',
    price: 39.95,
    img: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    description: 'Yet another item',
  },
];



async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = {
    bufferCommands: false,
  };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  if (!mongoose.connection.db){
    throw new Error('DB connection not ready')
  }
  await mongoose.connection.db.dropDatabase();

  const insertedProducts = await Products.insertMany(products);
  const users :  User[] = [
      {
        email: 'johndoe@example.com',
        password: await bcrypt.hash('1234', 10),
        name: 'John',
        surname: 'Doe',
        address: '123 Main St, 12345 New York, United States',
        birthdate: new Date('1970-01-01'),
        cartItems: [
          {
            product: insertedProducts[0]._id,
            qty: 2,
          },
          {
            product: insertedProducts[1]._id,
            qty: 5,
          },
        ],
        orders: [],
      },
      {
        email: 'janedoe@example.com',
        password: await bcrypt.hash('5678', 10),
        name: 'Jane',
        surname: 'Doe',
        address: '456 Elm St, 67890 Los Angeles, United States',
        birthdate: new Date('1985-05-15'),
        cartItems: [
          {
            product: insertedProducts[1]._id,
            qty: 1,
          },
          {
            product: insertedProducts[0]._id,
            qty: 3,
          },
        ],
        orders: [],
      },
    ];
  const res = await Users.create(users);
  console.log(JSON.stringify(res, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);