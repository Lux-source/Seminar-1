import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/handlers';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import AddToCartButton from '@/components/addToCartButton';
import CartItemCounter from '@/components/CartItemCounter';

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
    <div className="flex flex-col items-center justify-center p-8 md:flex-row">
      {/* Product Image */}
      <div className="mb-8 flex w-full justify-center md:mb-0 md:w-1/2">
        {product.img && (
          <img
            src={product.img}
            alt={product.name}
            className="w-full max-w-sm object-contain dark:rounded-lg dark:bg-gray-800"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex w-full flex-col items-center text-center md:w-1/2">
        <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100 md:text-5xl">
          {product.name}
        </h2>
        <p className="mb-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
          {product.description || 'Description not available'}
        </p>
        <p className="mb-10 text-2xl font-extrabold text-gray-900 dark:text-gray-100">
        {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.price) + ' €'}
        </p>

        {/* Add/Delete Functionality */}
        {isLoggedIn ? (
          <div className='w-full flex flex-col items-center space-y-4'>
          <CartItemCounter
          userId={session.userId}
          productId={product._id.toString()}
          value={1} 
          />
          <AddToCartButton userId={session.userId} productId={product._id.toString()} quantity={1} />
          </div>
          
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {/* Message for Not Logged-in Users */}
            <button
              disabled
              className="w-full bg-gray-400 text-gray-800 font-bold py-3 rounded-lg dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
            >
              Login to modify quantity
            </button>
            <Link href="/auth/signin">
              <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition duration-300">
                Sign in to manage your cart
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
