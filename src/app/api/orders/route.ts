import { NextRequest, NextResponse } from 'next/server';
import { getOrders, GetOrderResponse } from '@/lib/handlers';

export async function GET( request: NextRequest ):
Promise<NextResponse<GetOrderResponse>> {
  const orders = await getOrders();
  return NextResponse.json(orders);
}