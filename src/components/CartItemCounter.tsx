'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItemCounterProps {
  userId: string;
  productId: string;
  value: number;
}

export default function CartItemCounter({ userId, productId, value }: CartItemCounterProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(value); // Inicia con el valor recibido
  const [isUpdating, setIsUpdating] = useState(false);

  const updateCart = async (newQuantity: number) => {
    setIsUpdating(true);
    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: newQuantity }),
      });
      setQuantity(newQuantity); // Actualiza el estado local
      router.refresh(); // Refresca el estado de la página
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = () => {
    updateCart(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateCart(quantity - 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Math.min(50, Number(event.target.value))); // Limita entre 1 y 50
    setQuantity(newQuantity);
  };

  const handleBlur = () => {
    updateCart(quantity); // Actualiza el carrito al perder foco
  };

  return (
    <div className="w-full h-11 flex items-center justify-between  rounded-lg bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
      {/* w-full h-14 flex items-center justify-between border border-gray-300 rounded-lg bg-gray-100 dark:border-gray-600 dark:bg-gray-700 */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isUpdating || quantity <= 1}
        className="h-11 items-center w-11 rounded-l-lg border border-gray-300 bg-gray-100 p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-900"
      >
        <svg
          className="h-4 w-4 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>

      {/* Campo de entrada de cantidad */}
      <input
        type="number"
        id="quantity-input"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min="1"
        max="50"
        disabled={isUpdating}
        className="h-11 w-16 text-center w-full border-t border-b border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        style={{ appearance: 'textfield' }}
      />

      {/* Botón para incrementar */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isUpdating}
        className="h-11 w-11 rounded-r-lg border border-gray-300 bg-gray-100 p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
      >
        <svg
          className="h-4 w-4 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
}
