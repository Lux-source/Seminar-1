import { redirect } from 'next/navigation';
import { getOrder } from '@/lib/handlers';
import { getSession } from '@/lib/auth';
import Image from 'next/image';

export default async function OrderDetails({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/signin');
  }

  const order = await getOrder(session.userId, params.orderId);
  if (!order) {
    redirect('/auth/profile'); // Redirige si el pedido no pertenece al usuario
  }

  return (
    <div className="container mx-auto p-6 text-center">
      <h3 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
      Order Details
      </h3>

      {/* Información del Pedido */}
      <div className="card bg-white dark:bg-gray-700 shadow-xl p-6 mb-8">
      <p className="text-lg text-gray-700 dark:text-gray-300">
      <strong>Order ID:</strong> {order._id.toString()}
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          <strong>Address:</strong> {order.address}
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          <strong>Cardholder:</strong> {order.cardHolder}
        </p>
      </div>

      {/* Productos del Pedido */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {order.orderItems.map((orderItem) => (
          <div
            key={orderItem.product._id.toString()}
            className="card bg-white dark:bg-gray-700 shadow-xl dark:shadow-gray-700 flex flex-col p-4"
          >
            {/* Imagen del Producto */}
            <figure className="w-full flex justify-center mb-4">
              <Image
                src={orderItem.product.img}
                alt={orderItem.product.name}
                width={400}
                height={300}
                className="object-cover"
              />
            </figure>

            {/* Contenedor de Información del Producto */}
            <div className="flex flex-col flex-grow items-center text-center">
              {/* Nombre del Producto */}
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                {orderItem.product.name}
              </h2>

              {/* Cantidad y Precio */}
              <div className="mt-auto mb-4">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                  Quantity: {orderItem.qty}
                </p>
                <p className="text-xl font-semibold text-black dark:text-gray-100 mt-1">
                  {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(orderItem.qty * orderItem.price) + ' €'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
