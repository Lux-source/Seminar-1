import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/handlers';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const product = await getProductById(params.productId);
  if (product === null) {
    notFound();
  }

  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-8">
      {/* Product Image */}
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
        {product.img && (
          <img
            src={product.img}
            alt={product.name}
            className="max-w-sm w-full object-contain"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {product.name}
        </h2>
        <p className="text-lg font-semibold text-gray-700 mb-6">
          {product.description || 'Description not available'}
        </p>
        <p className="text-2xl font-extrabold text-gray-900 mb-10">
          EUR {product.price.toFixed(2)}
        </p>

        {/* Add/Delete Functionality */}
        {isLoggedIn ? (
          <>
            {/* Acciones del Producto */}
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
                  value={1} // Valor fijo
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

              <button className="btn btn-outline btn-error">Delete</button>
            </div>
          </>
        ) : (
          <Link href="/auth/signin">
            <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition duration-300">
              Must be logged in to manage your cart
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
