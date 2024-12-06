'use client';

import { useRouter } from 'next/navigation';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';

export default function NavbarSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/auth/signin'); 
      } else {
        console.error('Sign-out failed');
      }
    } catch (error) {
      console.error('Error during sign-out', error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-full p-2 text-gray-400 hover:text-gray-900 focus:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-gray-300 dark:hover:text-white dark:focus:text-white dark:focus:ring-gray-300"
    >
      <span className="sr-only">Sign out</span>
      <ArrowRightStartOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
