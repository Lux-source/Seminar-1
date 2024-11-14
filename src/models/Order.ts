import mongoose, {mongo, Schema, Types} from "mongoose";

export interface OrderItem {
  product: Types.ObjectId;
  qty: number;
  price: number; // Add price field
}

export interface Order {
  userId: Types.ObjectId;
  orderItems: OrderItem[];
  address: string;
  date: Date;
  cardHolder: string;
  cardNumber: string;
}

const OrderSchema = new Schema<Order>({
  userId: {
    type: Schema.Types.ObjectId, ref: 'User', required: true},
    orderItems: [
      {
        _id: false,
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }, // Add price field
      },
    ],
    address: { type: String, required: true},
    date: {type: Date, required: true, default: Date.now}, 
    cardHolder: {type: String, required:true},
    cardNumber: {type: String, required: true}, 
});

export default (mongoose.models.Order as mongoose.Model<Order>) || mongoose.model<Order>('Order', OrderSchema);