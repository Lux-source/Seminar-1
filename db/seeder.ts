import Order from '@/models/Order'
import Products, { Product } from '@/models/Product'
import Users, { User } from '@/models/User'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { resolve } from 'path'

dotenv.config({ path: `.env.local`, override: true })
const MONGODB_URI = process.env.MONGODB_URI

const products: Product[] = [
  {
    name: 'Chronograph Orlinski Black Magic',
    price: 18200.0,
    img: '/img/Classic-Fusion-Chronograph-Orlinski-Black-Magic-Soldier.png',
    description: 'El encuentro entre la relojería y la escultura...',
  },
  {
    name: 'Unico Sailing Team',
    price: 25200.0,
    img: '/img/big-bang-unicoo-sailing-team-soldier-shot.png',
    description: 'By developing its own automatic chronograph movement, Hublot wanted it to be – like all of its creations – the first, different and unique.',
  },
  {
    name: 'Unico Magic Gold',
    price: 44500.0,
    img: '/img/Square-Bang-Unico-Magic-Gold-42-mm-Soldier.png',
    description: 'Scratch-proof gold had never existed before, so Hublot invented it...',
  },
  {
    name: 'MP-15 Takashi Murakami Tourbillon Sapphire Rainbow',
    price: 389000.0,
    img: '/img/reloj-flor.png',
    description: 'A disruptive and unconventional shape',
  },
  {
    name: 'Big Bang Integral Time Soldier',
    price: 13100.0,
    img: '/img/big-bang-integral-time-onlytitanium-38-mm-soldier.png',
    description: 'The true aesthetic signature of the Big Bang Integrated, the integrated bracelet, returns to give the watch its strength.',
  },
  {
    name: 'Big Bang Unico Novak-Djokovic',
    price: 52700.0,
    img: '/img/big-bang-unico-Novak-Djokovic-42-mm-soldier_0.png',
    description: `This new timepiece is a horological manifesto from Hublot. Innovative, smashing convention with case and bezel in a composite of the tennis GOAT Novak Djokovic`,
  },
  {
    name: 'Big Bang Unico Ice Bang',
    price: 52700.0,
    img: '/img/Big-Bang-Unico-Yellow-Magic.png',
    description: 'By developing its own automatic chronograph movement, Hublot wanted it to be like all of its creations: the first, different and unique.',
  },
  {
    name: 'Spirit of Big Bang Tourbillon Sorai Soldier',
    price: 110000.0,
    img: '/img/spirit-of-big-bang-tourbillon-sorai-42-mm-soldier_0.png',
    description: 'Hublot introduces the Spirit of Big Bang SORAI, a 30-piece limited-edition created in support of SORAI',
  },
]

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }

  const opts = {
    bufferCommands: false,
  }
  const conn = await mongoose.connect(MONGODB_URI, opts)

  if (!mongoose.connection.db) {
    throw new Error('DB connection not ready')
  }
  await mongoose.connection.db.dropDatabase()

  const insertedProducts = await Products.insertMany(products)
  const users: User[] = [
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
  ]
  // For checking the profile orders appear correctly
  const res = await Users.create(users)
  console.log(JSON.stringify(res, null, 2))
  const johnDoe = res.find((user) => user.email === 'johndoe@example.com')
  if (!johnDoe) {
    throw new Error('John Doe not found')
  }

  const orders = [
    {
      userId: johnDoe._id,
      orderItems: [
        {
          product: insertedProducts[0]._id,
          qty: 2,
          price: insertedProducts[0].price,
        },
        {
          product: insertedProducts[1]._id,
          qty: 5,
          price: insertedProducts[1].price,
        },
      ],
      address: johnDoe.address,
      date: new Date('2023-01-01'),
      cardHolder: 'John Doe',
      cardNumber: '1234567812345678',
    },
    {
      userId: johnDoe._id,
      orderItems: [
        {
          product: insertedProducts[2]._id,
          qty: 1,
          price: insertedProducts[2].price,
        },
        {
          product: insertedProducts[3]._id,
          qty: 2,
          price: insertedProducts[3].price,
        },
      ],
      address: johnDoe.address,
      date: new Date('2023-06-01'),
      cardHolder: 'John Doe',
      cardNumber: '8765432187654321',
    },
  ]
  const createdOrders = await Order.insertMany(orders)
  johnDoe.orders = createdOrders.map((order) => order._id)
  await johnDoe.save()

  await conn.disconnect()
}

seed().catch(console.error)
