import { NextRequest,NextResponse } from "next/server";
import {
  createOrder,
  CreateOrderResponse,
  ErrorResponse,
} from '@/lib/handlers';
import { Types } from 'mongoose';


export async function POST(
  request: NextRequest,
  { params }: { params : { userId: string } }
): Promise<NextResponse<CreateOrderResponse | ErrorResponse>>{
  const { userId } = params;
  const data  = await request.json();

  //Validar userId
if (!Types.ObjectId.isValid(userId)) {
  return NextResponse.json(
    {
      error: 'WRONG_PARAMS',
      message: 'Invalid user ID',
    },
    { status: 400}
  );
}

  const { address, cardHolder, cardNumber} = data;

  // Validate order details
  if (!address || !cardHolder || !cardNumber) {
    return NextResponse.json(
      {
        error: 'INVALID_DATA',
        message: 'Missing order details.'
      },
      {status: 400}
    );
  }

  const order = await createOrder(userId, {address, cardHolder, cardNumber});

  if (order === null){
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or cart is empty.'
      },
      {status: 400}
    );
  }

  // Include Location header in the response
  return NextResponse.json(order, {
  status: 201,
  headers: {
    Location: `/api/users/${userId}/orders/${order.orderId}`,
  },
});
}