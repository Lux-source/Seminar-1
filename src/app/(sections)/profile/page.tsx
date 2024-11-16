import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUser, getUserOrders } from '@/lib/handlers'

export default async function Profile() {
  // Obtener la sesión del usuario
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin') // Redirigir al inicio de sesión si no está autenticado
  }

  // Obtener la información del usuario y los pedidos
  const user = await getUser(session.userId)
  const orders = await getUserOrders(session.userId)

  if (!user) {
    redirect('/auth/signin') // Redirigir si el usuario no existe
  }

  return (
    <div className="container mx-auto p-6">
      <h3 className="text-4xl font-bold text-center mb-8">Perfil de Usuario</h3>

      {/* Información del Usuario */}
      <div className="card bg-base-100 shadow-xl p-6 mb-8">
        <h4 className="text-2xl font-bold mb-4">Información Personal</h4>
        <p className="text-lg"><strong>Nombre:</strong> {user.name} {user.surname}</p>
        <p className="text-lg"><strong>Email:</strong> {user.email}</p>
        <p className="text-lg"><strong>Dirección:</strong> {user.address}</p>
        <p className="text-lg"><strong>Fecha de Nacimiento:</strong> {new Date(user.birthdate).toLocaleDateString()}</p>
      </div>

      {/* Pedidos del Usuario */}
      <div className="card bg-base-100 shadow-xl p-6">
        <h4 className="text-2xl font-bold mb-4">Órdenes Realizadas</h4>
        {orders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID de Orden</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Dirección</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Detalles</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{order.address}</td>
                    <td className="px-4 py-2">
                      {order.orderItems.reduce(
                        (total, item) => total + item.qty * item.price,
                        0
                      ).toFixed(2)} €
                    </td>
                    <td className="px-4 py-2">
                      <a
                        href={`/api/users/${session.userId}/orders/${order._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Ver Detalles
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-lg">No has realizado ningún pedido todavía.</p>
        )}
      </div>
    </div>
  )
}
