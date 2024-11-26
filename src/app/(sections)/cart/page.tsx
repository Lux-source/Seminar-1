import { redirect } from 'next/navigation';
import { getUserCart } from '@/lib/handlers';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import Image from 'next/image';

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
      <h3 className="text-4xl font-bold text-center mb-8">
        My Shopping Cart
      </h3>

      {/* Dynamic Button */}
      {cartItemsData.cartItems.length === 0 ? (
        <button
          className="btn btn-wide bg-black text-white text-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300 mb-4 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-red-600"
          disabled
        >
          Empty Cart
        </button>
      ) : (
        <button
          className="btn btn-wide bg-black text-white text-lg hover:bg-green-700 hover:scale-105 transition-transform duration-300 mb-4 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-green-600"
        >
          Checkout
        </button>
      )}

      {cartItemsData.cartItems.length === 0 ? (
        <div className="text-center">
          <span className="text-lg text-gray-500 dark:text-gray-400">
            The cart is empty
          </span>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cartItemsData.cartItems.map((cartItem) => (
            <div
              key={cartItem.product._id.toString()}
              className="group card bg-white shadow-xl flex flex-col p-4 dark:bg-gray-800 dark:shadow-gray-700 transform transition-transform duration-300 hover:scale-105"
            >
              {/* Product Image */}
              <figure className="w-full flex justify-center mb-4">
                <Image
                  src={cartItem.product.img}
                  alt={cartItem.product.name}
                  width={400}
                  height={300}
                  className="object-cover rounded-lg group-hover:opacity-95"
                />
              </figure>

              {/* Product Info */}
              <div className="flex flex-col flex-grow items-center text-center">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center dark:text-gray-100">
                  <Link
                    href={`/products/${cartItem.product._id.toString()}`}
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
                    {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cartItem.product.price) + ' €'}
                  </p>
                </div>
              </div>

              {/* Product Actions */}
              <div className="card-actions w-full flex justify-between items-center">
                <div className="flex items-center gap-2 flex-grow">
                  <button
                    type="button"
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 2"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h16"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    id="quantity-input"
                    value={1}
                    readOnly
                    min="1"
                    max="50"
                    className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    style={{ appearance: 'textfield' }}
                  />
                  <button
                    type="button"
                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <svg
                      className="w-3 h-3 text-gray-900 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </button>
                </div>

                <button className="btn btn-outline btn-error dark:border-red-500 dark:text-red-500 group-hover:scale-105 transition-transform duration-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
