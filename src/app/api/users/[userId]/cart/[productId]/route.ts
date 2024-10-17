import { NextRequest, NextResponse } from "next/server";
import {
  updateCartItem,
  deleteCartItem,
  GetUserCartResponse,
  ErrorResponse,
} from '@/lib/handlers';
import { Types } from 'mongoose';

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<GetUserCartResponse | ErrorResponse>> {
  const { userId, productId } = params;

  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or product ID.',
      },
      { status: 400 }
    );
  }

  const data = await request.json();
  const { qty } = data;

  if (typeof qty !== 'number' || qty < 1) {
    return NextResponse.json(
      {
        error: 'INVALID_DATA',
        message: 'Quantity must be greater than or equal to 1.',
      },
      { status: 400 }
    );
  }

  const cart = await updateCartItem(userId, productId, qty);

  if (cart === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User or product not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(cart, {
    status: cart.newItem ? 201 : 200,
    headers: cart.newItem
      ? {
          Location: `/api/users/${userId}/cart/${productId}`,
        }
      : undefined,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<GetUserCartResponse | ErrorResponse>> {
  const { userId, productId } = params;

  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or product ID.',
      },
      { status: 400 }
    );
  }

  const cart = await deleteCartItem(userId, productId);

  if (cart === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(cart);
}