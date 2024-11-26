import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/handlers'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }

  const product = await getProductById(params.productId)
  if (product === null) {
    notFound()
  }

  const session = await getSession()
  const isLoggedIn = !!session

  return (
    <div className='flex flex-col items-center justify-center p-8 md:flex-row'>
      {/* Product Image */}
      <div className='mb-8 flex w-full justify-center md:mb-0 md:w-1/2'>
        {product.img && (
          <img
            src={product.img}
            alt={product.name}
            className='w-full max-w-sm object-contain dark:rounded-lg dark:bg-gray-800'
          />
        )}
      </div>

      {/* Product Details */}
      <div className='flex w-full flex-col items-center text-center md:w-1/2'>
        <h2 className='mb-4 text-4xl font-extrabold text-gray-900 dark:text-gray-100 md:text-5xl'>
          {product.name}
        </h2>
        <p className='mb-6 text-lg font-semibold text-gray-700 dark:text-gray-300'>
          {product.description || 'Description not available'}
        </p>
        <p className='mb-10 text-2xl font-extrabold text-gray-900 dark:text-gray-100'>
          EUR {product.price.toFixed(2)}
        </p>

        {/* Add/Delete Functionality */}
        {isLoggedIn ? (
          <>
            {/* Acciones del Producto */}
            <div className='card-actions flex w-full items-center justify-between'>
              <div className='flex flex-grow items-center gap-2'>
                <button
                  type='button'
                  className='h-11 rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700'
                >
                  <svg
                    className='h-3 w-3 text-gray-900 dark:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 18 2'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M1 1h16'
                    />
                  </svg>
                </button>
                <input
                  type='number'
                  id='quantity-input'
                  value={1} // Valor fijo
                  readOnly
                  min='1'
                  max='50'
                  className='block h-11 w-full border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  style={{ appearance: 'textfield' }}
                />
                <button
                  type='button'
                  className='h-11 rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700'
                >
                  <svg
                    className='h-3 w-3 text-gray-900 dark:text-white'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 18 18'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 1v16M1 9h16'
                    />
                  </svg>
                </button>
              </div>
              <button className='btn btn-outline btn-error dark:border-red-600 dark:hover:bg-red-700'>
                Delete
              </button>
            </div>
          </>
        ) : (
          <Link href='/auth/signin'>
            <button className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition duration-300">
            Must be logged in to manage your cart
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}
