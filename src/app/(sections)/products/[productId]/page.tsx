import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/handlers'

export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }

  const product = await getProductById(params.productId)
  if (product === null) {
    notFound()
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        {product.name}
      </h3>
      {product.description && <p>{product.description}</p>}
      {/* Here you should show the details of the product. */}
    </div>
  )
}