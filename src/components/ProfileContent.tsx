'use client';

import { GetUserResponse } from '@/lib/handlers';
import { GetUserOrdersResponse } from '@/lib/handlers';

export default function ProfileContent({
  user,
  orders,
}: {
  user: GetUserResponse;
  orders: GetUserOrdersResponse['orders'];
}) {
  return (
    <div className="container mx-auto p-6">
      <h3 className="mb-8 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
        User Profile
      </h3>
      {/* Personal Information */}
      <div className="card mb-8 bg-base-100 p-6 shadow-xl dark:bg-gray-800 dark:text-gray-300">
        <h4 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Personal Information
        </h4>
        <p className="text-lg">
          <strong>Name:</strong> {user.name} {user.surname}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-lg">
          <strong>Address:</strong> {user.address}
        </p>
        <p className="text-lg">
          <strong>Birth Date:</strong>{' '}
          {new Date(user.birthdate).toLocaleDateString()}
        </p>
      </div>

      {/* Orders */}
      <div className="card bg-base-100 p-6 shadow-xl dark:bg-gray-800 dark:text-gray-300">
        <h4 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Completed Orders
        </h4>
        {orders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Order ID
                  </th>
                  <th className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Address
                  </th>
                  <th className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Total
                  </th>
                  <th className="px-4 py-2 text-gray-700 dark:text-gray-300">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const totalPrice = order.orderItems.reduce(
                    (total, item) => total + item.qty * item.price,
                    0
                  );

                  const formattedTotalPrice = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(totalPrice) + ' €';

                  return (
                    <tr
                    key={order._id.toString()}
                      className="border-b border-gray-300 dark:border-gray-700"
                    >
                      <td className="px-4 py-2">{order._id.toString()}</td>
                      <td className="px-4 py-2">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{order.address}</td>
                      <td className="px-4 py-2">
                        <span style={{ whiteSpace: 'nowrap' }}>
                          {formattedTotalPrice}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <a
                          href={`/orders/${order._id}`}
                          className="text-blue-500 dark:text-blue-400 hover:underline"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You have not made any orders yet
          </p>
        )}
      </div>
    </div>
  );
}
