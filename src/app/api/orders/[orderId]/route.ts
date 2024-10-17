import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getOrderById, GetOrderResponse, ErrorResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { orderId: string };
  }
): Promise<NextResponse<GetOrderResponse | ErrorResponse>> {
  const { orderId } = params;

  // Validate userId and orderId
  if (!Types.ObjectId.isValid(orderId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid order ID.',
      },
      { status: 400 }
    );
  }

  // Fetch the order ensuring it belongs to the user
  const order = await getOrderById(orderId);

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