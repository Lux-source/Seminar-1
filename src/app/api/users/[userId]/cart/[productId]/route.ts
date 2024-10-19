import { NextRequest, NextResponse } from "next/server";
import Users from '@/models/User';
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

  // Validate userId and productId
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

  // Validate quantity
  if (typeof qty !== 'number' || qty < 1) {
    return NextResponse.json(
      {
        error: 'INVALID_DATA',
        message: 'Quantity must be greater than or equal to 1.',
      },
      { status: 400 }
    );
  }

  // Check if the user exists
  const user = await Users.findById(userId);
  if (!user) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    );
  }


  // Check if product already exists in cart
  const existingCartItemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  let newItem = false;

  if (existingCartItemIndex === -1){
    // Product not in cart, add it
    user.cartItems.push({
      product: new Types.ObjectId(productId),
      qty: qty,
    });
    newItem = true; // Mark it
  } else {
    user.cartItems[existingCartItemIndex].qty = qty;
  }

  // Save user changes
  await user.save();

  // Populate cart
  await user.populate({
    path: 'cartItems.product',
    select: 'name price img description',
  });

  //Return updated cart
  return NextResponse.json(
    { cartItems: user.cartItems, newItem},
    {
      status: newItem ? 201 : 200,
      headers: newItem
      ? {
        Location: `/api/users/${userId}/cart/${productId}`,
      }
      : undefined,
    }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string; productId: string } }
): Promise<NextResponse<GetUserCartResponse | ErrorResponse>> {
  const { userId, productId } = params;

  // Validate userId and productId
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or product ID.',
      },
      { status: 400 }
    );
  }

  // Find user by userId
  const user = await Users.findById(userId);
  if (!user) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    );
  }

  // Check if the product exists in the cart
  const cartItemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (cartItemIndex === -1) {
    // Product not found in user's cart
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Product not found in cart.',
      },
      { status: 404 }
    );
  }

  // Remove the product from the cart
  user.cartItems.splice(cartItemIndex, 1);
  await user.save();

  // Call handler to update cart data if necessary
  const cart = await deleteCartItem(userId, productId);

  if (cart === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User or product not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(cart);
}
