import { redirect } from 'next/navigation';
import { getUserCart } from '@/lib/handlers';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import Image from 'next/image';

export default async function Cart() {
  const session = await getSession();

  // Redirige a signin si no está logueado
  if (!session) {
    redirect('/auth/signin');
  }

  const cartItemsData = await getUserCart(session.userId);

  // Si no hay datos del carrito, también redirige
  if (!cartItemsData) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto p-6 text-center">
      <h3 className="text-4xl font-bold text-center mb-8">
        Mi Carrito de Compras
      </h3>

      {/* Botón dinámico */}
      {cartItemsData.cartItems.length === 0 ? (
        <button
          className="btn btn-wide bg-black text-white text-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300 mb-4"
          disabled
        >
          Carrito Vacío
        </button>
      ) : (
        <button
          className="btn btn-wide bg-black text-white text-lg hover:bg-green-700 hover:scale-105 transition-transform duration-300 mb-4"
        >
          Place Order
        </button>
      )}

      {cartItemsData.cartItems.length === 0 ? (
        <div className="text-center">
          <span className="text-lg text-gray-500">El carrito está vacío</span>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cartItemsData.cartItems.map((cartItem) => (
            <div
              key={cartItem.product._id.toString()}
              className="card bg-base-100 shadow-xl flex flex-col p-4"
            >
              {/* Imagen del Producto */}
              <figure className="w-full flex justify-center mb-4">
                <Image
                  src={cartItem.product.img}
                  alt={cartItem.product.name}
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </figure>

              {/* Contenedor de Información del Producto */}
              <div className="flex flex-col flex-grow items-center text-center">
                {/* Nombre del Producto con altura mínima */}
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
                  <Link href={`/products/${cartItem.product._id.toString()}`}>
                    {cartItem.product.name}
                  </Link>
                </h2>

                {/* Cantidad y Precio */}
                <div className="mt-auto mb-4">
                  <p className="text-lg">Cantidad: {cartItem.qty}</p>
                  <p className="text-xl font-semibold text-black mt-1">
                    {cartItem.product.price.toFixed(2)} €
                  </p>
                </div>
              </div>

              {/* Acciones del Producto */}
              <div className="card-actions w-full flex justify-around">
                <button className="btn btn-outline btn-base-content">
                  Actualizar Cantidad
                </button>
                <button className="btn btn-outline btn-error">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
