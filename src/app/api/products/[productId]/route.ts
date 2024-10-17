import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { getProductById, GetProductResponse, ErrorResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
): Promise<NextResponse<GetProductResponse | ErrorResponse>> {
  const { productId } = params;

  if (!Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid product ID.',
      },
      { status: 400 }
    );
  }

  const product = await getProductById(productId);

  if (!product) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Product not found.',
      },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}