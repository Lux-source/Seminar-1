import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUser, getUserOrders } from '@/lib/handlers'

export default async function Profile() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin') // Redirige si no hay sesión
  }

  // Obtiene los datos del usuario y sus órdenes
  const user = await getUser(session.userId)
  const orders = await getUserOrders(session.userId)

  if (!user) {
    redirect('/auth/signin') // Redirige si no encuentra al usuario
  }

  return (
    <div className='container mx-auto p-6'>
      <h3 className='mb-8 text-center text-4xl font-bold'>User Profile</h3>

      {/* Información Personal */}
      <div className='card mb-8 bg-base-100 p-6 shadow-xl'>
        <h4 className='mb-4 text-2xl font-bold'>Personal Information</h4>
        <p className='text-lg'>
          <strong>Name:</strong> {user.name} {user.surname}
        </p>
        <p className='text-lg'>
          <strong>Email:</strong> {user.email}
        </p>
        <p className='text-lg'>
          <strong>Address:</strong> {user.address}
        </p>
        <p className='text-lg'>
          <strong>Birth Date:</strong>{' '}
          {new Date(user.birthdate).toLocaleDateString()}
        </p>
      </div>

      {/* Órdenes */}
      <div className='card bg-base-100 p-6 shadow-xl'>
        <h4 className='mb-4 text-2xl font-bold'>Completed Orders</h4>
        {orders?.orders.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full table-auto text-left'>
              <thead>
                <tr>
                  <th className='px-4 py-2'>Order ID</th>
                  <th className='px-4 py-2'>Date</th>
                  <th className='px-4 py-2'>Address</th>
                  <th className='px-4 py-2'>Total</th>
                  <th className='px-4 py-2'>Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.orders.map((order) => (
                  <tr key={order._id}>
                    <td className='px-4 py-2'>{order._id.toString()}</td>
                    <td className='px-4 py-2'>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-2'>{order.address}</td>
                    <td className='px-4 py-2'>
                      <span style={{ whiteSpace: 'nowrap' }}> 
                        {order.orderItems
                          .reduce(
                            (total, item) => total + item.qty * item.price,
                            0
                          )
                          .toFixed(2)}{' '}
                        €
                      </span>
                    </td>
                    <td className='px-4 py-2'>
                      <a
                        href={`/orders/${order._id}`}
                        className='text-blue-500 hover:underline'
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-lg'>You have not made any orders yet</p>
        )}
      </div>
    </div>
  )
}
