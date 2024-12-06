import { getSession } from '@/lib/auth'
import { getUserCart } from '@/lib/handlers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import mongoose from 'mongoose'

export default async function CheckoutPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const { cartItems } = (await getUserCart(session.userId)) || { cartItems: [] }

  const totalPrice = cartItems.reduce((total, item) => {
    if (item.product instanceof mongoose.Types.ObjectId) {
      // Not populated
      return total
    } else {
      // Populated
      return total + item.product.price * item.qty
    }
  }, 0)

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-md dark:bg-gray-900 sm:p-6 lg:p-8">
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100 sm:text-2xl lg:text-3xl">
      Checkout
      </h2>

      {cartItems.length > 0 ? (
        <>
          {/* Cart Summary */}
          <div className='mb-6 sm:mb-8'>
          <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Order Summary
            </h3>
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
            <thead>
                <tr className="border-b dark:border-gray-700">
                    <th className='py-2'>Product Name</th>
                    <th className='py-2 text-right'>Quantity</th>
                    <th className='py-2 text-right'>Price</th>
                    <th className='py-2 text-right'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product._id.toString()} className="border-b dark:border-gray-700">
                      <td className='py-2'>
                        <Link
                          href={`/products/${item.product._id}`}
                          className="text-blue-500 hover:underline dark:text-blue-400"
                        >
                          {item.product.name}
                        </Link>
                      </td>
                      <td className='py-2 text-right'>{item.qty}</td>
                      <td className='py-2 text-right'>
                        {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.product.price) + ' €'}
                      </td>
                      <td className='py-2 text-right'>
                        {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.qty * item.product.price) + ' €'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-2 text-right font-semibold text-gray-900 dark:text-gray-100"
                >
                      Total:
                    </td>
                    <td
                  className="py-2 text-right font-semibold text-gray-900 dark:text-gray-100"
                >
                  {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalPrice) + ' €'}
                      
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Checkout Form */}
          <form className='space-y-4'>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Shipping and Payment Information
            </h3>

            {/* Address Input */}
            <div>
              <label
                htmlFor='address'
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Shipping Address
              </label>
              <input
                id='address'
                name='address'
                type='text'
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
            </div>

            {/* Card Holder and Card Number Inputs */}
            <div className='md:flex md:space-x-4'>
              <div className='md:flex-1'>
                <label
                  htmlFor='cardHolder'
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Card Holder
                </label>
                <input
                  id='cardHolder'
                  name='cardHolder'
                  type='text'
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
              </div>

              <div className='mt-4 md:mt-0 md:flex-1'>
                <label
                  htmlFor='cardNumber'
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                  Card Number
                </label>
                <input
                  id='cardNumber'
                  name='cardNumber'
                  type='text'
                  required
                  maxLength={16}
                  pattern='\d{16}'
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='button'
              disabled={!cartItems.length}
              className={`w-full rounded-md px-4 py-2 font-medium text-white shadow-sm ${
                cartItems.length
                ? 'bg-green-700 hover:bg-green-600 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                : 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
              }`}
            >
              Purchase
            </button>
          </form>
        </>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Your cart is empty.
        </p>      )}
    </div>
  )
}
