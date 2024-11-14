import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/handlers';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const product = await getProductById(params.productId);
  if (product === null) {
    notFound();
  }

  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6">
      {/* Imagen del Producto */}
      <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
        {product.img && (
          <img
            src={product.img}
            alt={product.name}
            className="max-w-sm w-full object-contain"
          />
        )}
      </div>

      {/* Detalles del Producto */}
      <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {product.name}
        </h2>
        <p className="text-lg font-semibold text-gray-700 mb-6 leading-relaxed">
          {product.description || 'Descripción no disponible'}
        </p>
        <p className="text-2xl font-extrabold text-gray-900 mb-10">
          EUR {product.price.toFixed(2)}
        </p>

        {isLoggedIn ? (
          <AddToCartButton productId={product._id.toString()} userId={session.userId} />
        ) : (
          <Link href="/auth/signin">
            <button className="bg-black text-white font-semibold py-3 px-6 rounded-md mt-4 transition duration-300 hover:bg-gray-800">
              Inicia sesión para añadir al carrito
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
