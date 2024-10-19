import { NextRequest, NextResponse } from "next/server";
import {
  createOrder,
  CreateOrderResponse,
  getUserOrders,
  GetUserOrdersResponse,
  ErrorResponse,
} from '@/lib/handlers';
import { Types } from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<CreateOrderResponse | ErrorResponse>> {
  const { userId } = params;

  // Validate userId
  if (!Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    );
  }

  const data = await request.json();
  const { address, cardHolder, cardNumber } = data;

  // Validate order details
  if (!address || !cardHolder || !cardNumber) {
    return NextResponse.json(
      {
        error: 'INVALID_DATA',
        message: 'Missing order details.',
      },
      { status: 400 }
    );
  }

  // Regular expression for only digit cardNum
  const cardNumberRegex = /^\d{16}$/;
  if (!cardNumberRegex.test(cardNumber)) {
    return NextResponse.json(
      {
        error: 'INVALID_CARD',
        message: 'Invalid card number. Must be 16 digits and contain only numbers.',
      },
      { status: 400 }
    );
  }

  const order = await createOrder(userId, { address, cardHolder, cardNumber });

  if (order === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found or cart is empty.',
      },
      { status: 400 }
    );
  }

  // Include Location header in the response
  return NextResponse.json({ orderId: order.orderId }, {
    status: 201,
    headers: {
      Location: `/api/users/${userId}/orders/${order.orderId}`,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse<GetUserOrdersResponse | ErrorResponse>> {
  const { userId } = params;

  // Validate userId
  if (!Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      },
      { status: 400 }
    );
  }

  const orders = await getUserOrders(userId);

  if (orders === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(orders);
}