import { getSession } from '@/lib/auth';
import { getUserCart } from '@/lib/handlers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import mongoose from 'mongoose';

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/signin');
  }


  const { cartItems } = (await getUserCart(session.userId)) || { cartItems: [] };

  const totalPrice = cartItems.reduce((total, item) => {
    if (item.product instanceof mongoose.Types.ObjectId) {
      // Not populated
      return total;
    } else {
      // Populated
      return total + item.product.price * item.qty;
    }
  }, 0);

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Checkout</h2>

      {cartItems.length > 0 ? (
        <>
          {/* Cart Summary */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Order Summary
            </h3>
            <div className="overflow-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Product Name</th>
                    <th className="py-2 text-right">Quantity</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product._id.toString()} className="border-b">
                      <td className="py-2">
                        <Link
                          href={`/products/${item.product._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {item.product.name}
                        </Link>
                      </td>
                      <td className="py-2 text-right">{item.qty}</td>
                      <td className="py-2 text-right">
                        {item.product.price.toFixed(2)} €
                      </td>
                      <td className="py-2 text-right">
                        {(item.qty * item.product.price).toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-2 text-right font-semibold">
                      Total:
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {totalPrice.toFixed(2)} €
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Checkout Form */}
          <form className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Shipping and Payment Information
            </h3>

            {/* Address Input */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Shipping Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Card Holder Input */}
            <div>
              <label
                htmlFor="cardHolder"
                className="block text-sm font-medium text-gray-700"
              >
                Card Holder
              </label>
              <input
                id="cardHolder"
                name="cardHolder"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Card Number Input */}
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Card Number
              </label>
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                required
                maxLength={16}
                pattern="\d{16}"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={!cartItems.length}
              className={`w-full py-2 px-4 rounded-md text-white font-medium shadow-sm ${
                cartItems.length
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Purchase
            </button>
          </form>
        </>
      ) : (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
}