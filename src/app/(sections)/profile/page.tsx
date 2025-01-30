import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getUser, getUserOrders } from '@/lib/handlers';
import ProfileContent from '@/components/ProfileContent';

export default async function Profile() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/signin'); // Redirects if no session
  }

  // Fetch user data and orders
  const user = await getUser(session.userId);
  const orders = await getUserOrders(session.userId);

  if (!user) {
    redirect('/auth/signin'); // Redirects if user is not found
  }

  const plainUser = JSON.parse(JSON.stringify(user));
  const plainOrders = JSON.parse(JSON.stringify(orders?.orders || []));

  return <ProfileContent user={plainUser} orders={plainOrders} />;
    
}
