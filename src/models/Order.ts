import mongoose, { Schema } from 'mongoose';

export interface Order{
  date: Date;
  address: string;
  cardHolder: string;
  cardNumber: string;

}


const OrderSchema = new Schema<Order>({
  date: { type: Date , required:true },
  address: { type: String, required:true },
  cardHolder: { type: String, required:true, unique: true },
  cardNumber: { type: String, required:true, unique: true }
});

export default mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);