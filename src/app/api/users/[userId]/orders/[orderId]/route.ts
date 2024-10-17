import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getOrder, GetOrderResponse, ErrorResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; orderId: string } }
): Promise<NextResponse<GetOrderResponse | ErrorResponse>> {
  const { userId, orderId } = params;

  // Validate userId and orderId
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(orderId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or order ID.',
      },
      { status: 400 } 
    );
  }

  // Fetch the order ensuring it belongs to the user
  const order = await getOrder(userId, orderId);

  if (!order) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Order not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}