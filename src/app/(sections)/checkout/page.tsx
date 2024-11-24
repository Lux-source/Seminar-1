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
    <div className='mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-md sm:p-6 lg:p-8'>
      <h2 className='mb-4 text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl'>
        Checkout
      </h2>

      {cartItems.length > 0 ? (
        <>
          {/* Cart Summary */}
          <div className='mb-6 sm:mb-8'>
            <h3 className='mb-4 text-lg font-semibold text-gray-700'>
              Order Summary
            </h3>
            <div className='overflow-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='py-2'>Product Name</th>
                    <th className='py-2 text-right'>Quantity</th>
                    <th className='py-2 text-right'>Price</th>
                    <th className='py-2 text-right'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product._id.toString()} className='border-b'>
                      <td className='py-2'>
                        <Link
                          href={`/products/${item.product._id}`}
                          className='text-blue-500 hover:underline'
                        >
                          {item.product.name}
                        </Link>
                      </td>
                      <td className='py-2 text-right'>{item.qty}</td>
                      <td className='py-2 text-right'>
                        {item.product.price.toFixed(2)} €
                      </td>
                      <td className='py-2 text-right'>
                        {(item.qty * item.product.price).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className='py-2 text-right font-semibold'>
                      Total:
                    </td>
                    <td className='py-2 text-right font-semibold'>
                      {totalPrice.toFixed(2)} €
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Checkout Form */}
          <form className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-700'>
              Shipping and Payment Information
            </h3>

            {/* Address Input */}
            <div>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-gray-700'
              >
                Shipping Address
              </label>
              <input
                id='address'
                name='address'
                type='text'
                required
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
              />
            </div>

            {/* Card Holder and Card Number Inputs */}
            <div className='md:flex md:space-x-4'>
              <div className='md:flex-1'>
                <label
                  htmlFor='cardHolder'
                  className='block text-sm font-medium text-gray-700'
                >
                  Card Holder
                </label>
                <input
                  id='cardHolder'
                  name='cardHolder'
                  type='text'
                  required
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
              </div>

              <div className='mt-4 md:mt-0 md:flex-1'>
                <label
                  htmlFor='cardNumber'
                  className='block text-sm font-medium text-gray-700'
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
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='button'
              disabled={!cartItems.length}
              className={`w-full rounded-md px-4 py-2 font-medium text-white shadow-sm ${
                cartItems.length
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  : 'cursor-not-allowed bg-gray-400'
              }`}
            >
              Purchase
            </button>
          </form>
        </>
      ) : (
        <p className='text-center text-gray-500'>Your cart is empty.</p>
      )}
    </div>
  )
}
