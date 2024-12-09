import { getSession } from '@/lib/auth'
import { getUserCart } from '@/lib/handlers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import mongoose from 'mongoose'
import CheckOutForm from '@/components/CheckOutForm';

export default async function CheckoutPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const { cartItems } = (await getUserCart(session.userId)) || { cartItems: [] }

  const totalPrice = cartItems.reduce((total, item) => {
    if (item.product instanceof mongoose.Types.ObjectId) {
      // Not populated
      return total;
    } else {
      // Populated
      return total + item.product.price * item.qty;
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
          <CheckOutForm userId={session.userId} cartItemsLength={cartItems.length} />
        </>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Your cart is empty.
        </p>      )}
    </div>
  )
}
