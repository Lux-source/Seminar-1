import mongoose, {Schema, Types} from "mongoose";

export interface OrderItem {
  product: Types.ObjectId;
  qty: number;
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
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true}, //Otra opcion import Product arriba y poner ref: Products
        qty: { type: Number, required: true, min: 1},
      },
    ],
    address: { type: String, required: true},
    date: {type: Date, required: true, default: Date.now}, 
    cardHolder: {type: String, required:true},
    cardNumber: {type: String, required: true}, 
});

export default mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);