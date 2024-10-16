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
// Extract userId from the query parameters
  const { searchParams } = new URL(request.url);
  const userId  = searchParams.get('userId');

    //Validar userId
if (!userId || !Types.ObjectId.isValid(userId)) {
  return NextResponse.json(
    {
      error: 'WRONG_PARAMS',
      message: 'Invalid user ID',
    },
    { status: 400}
  );
}

  const data  = await request.json();

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