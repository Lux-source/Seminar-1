import { Product } from '@/models/Product'
import { Types } from 'mongoose'
import Link from 'next/link'

interface ProductTileProps {
  product: Product & { _id: Types.ObjectId }
}

export default function ProductTile({ product }: ProductTileProps) {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105"
    >
      <div className="aspect-h-1 aspect-w-2 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
      <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-95"
        />
      </div>
      <h3 className="flex-auto mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
        {product.name}
      </h3>
      <p className="mt-1 text-base font-medium text-gray-900 dark:text-gray-200">
        {product.price + ' €'}
      </p>
    </Link>
  )
}
