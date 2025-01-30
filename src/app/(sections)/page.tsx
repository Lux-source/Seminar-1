import ProductTile from '@/components/ProductTile';
import SampleClientComponent from '@/components/SampleClientComponent';
import { getProducts } from '@/lib/handlers';
import { Types } from 'mongoose';
import type { Product } from '@/models/Product';


export default async function Index() {
  const data = await getProducts();

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data.products.map((product) => {
          const productWithDetails = product as Product & { _id: Types.ObjectId };

          return (
            <ProductTile
              key={productWithDetails._id.toString()}
              product={productWithDetails}
            />
          );
        })}
      </div>
    </div>
  );
}
