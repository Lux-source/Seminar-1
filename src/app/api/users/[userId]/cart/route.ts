import { NextRequest, NextResponse } from "next/server";
import {
  getUserCart, 
  GetUserCartResponse,
  AddProductToCart,
  AddProductToCartResponse,
  ErrorResponse,
} from '@/lib/handlers';

import { Types } from 'mongoose';


export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string};
  }
): Promise<NextResponse<GetUserCartResponse | ErrorResponse>>{
  const { userId } = params;

  if (!Types.ObjectId.isValid(userId)){
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID',
      },
      { status: 400}

    );
  }

  const cart = await getUserCart(userId);

  if (cart === null){
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      {status: 400}
    );
  }

  return NextResponse.json(cart);
}

export async function POST(
  request: NextRequest,
  {
    params, 
  }: {
    params: {userId: string };
  }
): Promise<NextResponse<AddProductToCartResponse | ErrorResponse>>{
  const { userId } = params;
  const data = await request.json();

  if (!Types.ObjectId.isValid(userId)){
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.', 
      },
      {status: 400}
    );
  }

  const {productId, qty } = data;

  if (!productId || typeof qty !== 'number' || qty <= 0){
    return NextResponse.json(
      {
        error: 'INVALID_DATA',
        message: 'Invalid product ID or quantity.',
      },
      
      { status : 400}
    );
  }

  const cart = await AddProductToCart(userId, productId, qty);

  if (cart === null){
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User or product not found.',
      },
      {status: 400}
    );
  }

  return NextResponse.json(cart);
  
}