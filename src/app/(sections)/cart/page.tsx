import { redirect } from 'next/navigation';
import { getUserCart } from '@/lib/handlers';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import Image from 'next/image';
import CartItemCounter from '@/components/CartItemCounter';
import DeleteFromCartButton from '@/components/DeleteFromCartButton';
import { Types } from 'mongoose';

export default async function Cart() {
  const session = await getSession();

  // Redirect to signin if not logged in
  if (!session) {
    redirect('/auth/signin');
  }

  const cartItemsData = await getUserCart(session.userId);

  // Redirect if no cart data
  if (!cartItemsData) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto p-6 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h3 className="text-4xl font-bold text-center mb-8">My Shopping Cart</h3>

      {/* Dynamic Button */}
      {cartItemsData.cartItems.length === 0 ? (
        <button
          className="btn btn-wide bg-black text-white text-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300 mb-4 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-red-600"
          disabled
        >
          Empty Cart
        </button>
      ) : (
        <Link href="/checkout">
          <button
            className="btn btn-wide bg-black text-white text-lg hover:bg-green-700 hover:scale-105 transition-transform duration-300 mb-4 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-green-600"
          >
            Checkout
          </button>
        </Link>
      )}

      {cartItemsData.cartItems.length === 0 ? (
        <div className="text-center">
          <span className="text-lg text-gray-500 dark:text-gray-400">
            The cart is empty
          </span>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cartItemsData.cartItems.map((cartItem) => {
            const productWithId = cartItem.product as typeof cartItem.product & {
              _id: Types.ObjectId;
            };
            return (
              <div
                key={productWithId._id.toString()}
                className="group card bg-white shadow-xl flex flex-col p-4 dark:bg-gray-800 dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-105"
              >
                {/* Product Image */}
                <figure className="w-full flex justify-center mb-4">
                  <Image
                    src={cartItem.product.img || 'public/img/big-bang-integral-time-onlytitanium-38-mm-soldier.png'} // This was a way of avoiding potentially undefined cartItem.product.img
                    alt={cartItem.product.name || 'Reloj Image'}
                    width={400}
                    height={300}
                    className="object-cover rounded-lg group-hover:opacity-95"
                  />
                </figure>

                {/* Product Info */}
                <div className="flex flex-col flex-grow items-center text-center">
                  <h2 className="text-2xl font-bold mb-2 flex items-center justify-center dark:text-gray-100">
                    <Link
                      href={`/products/${productWithId._id.toString()}`}
                      className="text-gray-900 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-400 transition-colors duration-300"
                    >
                      {cartItem.product.name}
                    </Link>
                  </h2>

                  {/* Quantity and Price */}
                  <div className="mt-auto mb-4">
                    <p className="text-lg dark:text-gray-300">
                      Quantity: {cartItem.qty}
                    </p>
                    <p className="text-xl font-semibold text-black mt-1 dark:text-gray-200">
                      {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(cartItem.product.price) + ' €'}
                    </p>
                  </div>
                </div>

                {/* Product Actions */}
                <div className="card-actions flex w-full items-center space-x-2">
                  {/* Contador */}
                  <div className="flex-1">
                    <CartItemCounter
                      userId={session.userId}
                      productId={productWithId._id.toString()}
                      value={cartItem.qty}
                    />
                  </div>

                  {/* Botón de eliminar */}
                  <DeleteFromCartButton
                    userId={session.userId}
                    productId={productWithId._id.toString()}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
