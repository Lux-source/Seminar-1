import { getSession } from '@/lib/auth'
import { getUserCart } from '@/lib/handlers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CheckoutPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const cartItems = await getUserCart(session.userId)
  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.qty, 0)

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Checkout</h2>

      {cartItems.length > 0 ? (
        <>
          {/* Cart Summary */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700">Order Summary</h3>
            <div className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <div key={item.product._id} className="flex justify-between py-2">
                  <Link href={`/products/${item.product._id}`} className="text-blue-500">
                    {item.product.name}
                  </Link>
                  <p>{item.qty} x {item.product.price.toFixed(2)} €</p>
                  <p>{(item.qty * item.product.price).toFixed(2)} €</p>
                </div>
              ))}
            </div>
            <div className="text-right font-bold mt-4">Total: {totalPrice.toFixed(2)} €</div>
          </div>

          {/* Checkout Form */}
          <form className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Shipping and Payment Information</h3>

            {/* Address Input */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Card Holder Input */}
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">Card Holder</label>
              <input
                id="cardHolder"
                name="cardHolder"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Card Number Input */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                required
                maxLength={16}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={!cartItems.length}
            >
              Place Order
            </button>
          </form>
        </>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}
    </div>
  )
}
