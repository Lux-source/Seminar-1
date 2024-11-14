import mongoose, { Schema } from 'mongoose';

export interface Product {
  name: string;
  price: number;
  img?: string;
  description?: string;
}

const ProductSchema = new Schema<Product>({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  img: { type: String, required: false },
  description: { type: String, required: false },
});

export default (mongoose.models.Product as mongoose.Model<Product>)|| mongoose.model<Product>('Product', ProductSchema);
