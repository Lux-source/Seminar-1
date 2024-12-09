'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';

interface NavbarCartButtonProps {
  userId: string;
  href: string; // Add href for consistency with usage
  children?: ReactNode; // Add children prop
}

export default function NavbarCartButton({
  userId,
  href,
  children,
}: NavbarCartButtonProps) {
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}/cart`);
        if (response.ok) {
          const data = await response.json();
          // Sumar la cantidad total de productos en el carrito
          const totalItems = data.cartItems.reduce(
            (sum: number, item: { qty: number }) => sum + item.qty,
            0
          );
          setCartCount(totalItems);
        } else {
          console.error('Failed to fetch cart data');
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();

    // Opcional: Actualiza el contador cuando el carrito cambie
    const intervalId = setInterval(fetchCartData, 4000); // Cada segundo
    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <Link href={href} className="relative">
      <div className="relative inline-flex items-center" style={{ paddingTop: '10px' }}>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 text-gray-400 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5m12-5l2 5m-2-5H7"
          />
        </svg>

        {/* Contador del carrito */}
        {!isLoading && cartCount > 0 && (
          <span className="absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-900 text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </div>
    </Link>
  );
}
