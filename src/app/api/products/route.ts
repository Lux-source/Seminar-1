import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse, getProducts, GetProductsResponse } from '@/lib/handlers';

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetProductsResponse | ErrorResponse>> {

  // Fetch all products
  const products = await getProducts();

  return NextResponse.json(products, {status: 200});
}