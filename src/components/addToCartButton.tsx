// AddToCartButton.tsx

'use client';

import { useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
  userId: string;
}

export default function AddToCartButton({ productId, userId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const response = await fetch(`/api/users/${userId}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        qty: quantity,
      }),
    });

    if (response.ok) {
      alert('Product added to cart successfully!');
    } else {
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='max-w-xs mx-auto mb-3'>
        <label
          htmlFor='quantity-input'
          className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
        >
          Choose quantity:
        </label>
        <div className='relative flex items-center max-w-[8rem]'>
          <button
            type='button'
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
            className='bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none'
          >
            <svg
              className='w-3 h-3 text-gray-900 dark:text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 18 2'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 1h16'
              />
            </svg>
          </button>
          <input
            type='number'
            id='quantity-input'
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min='1'
            max='50'
            className='bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
            style={{ appearance: 'textfield' }}
            required
          />
          <button
            type='button'
            onClick={() => setQuantity((prev) => Math.min(prev + 1, 50))}
            className='bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none'
          >
            <svg
              className='w-3 h-3 text-gray-900 dark:text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 18 18'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 1v16M1 9h16'
              />
            </svg>
          </button>
        </div>
        <p
          id='helper-text-explanation'
          className='mt-2 text-sm text-gray-500 dark:text-gray-400'
        >
          Please select a quantity between 1 and 50.
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        className='rounded-lg bg-blue-500 py-3 px-6 text-xs font-bold uppercase text-white shadow-md transition-all hover:shadow-lg focus:opacity-85 active:opacity-85 disabled:opacity-50'
      >
        Add to Cart
      </button>
    </div>
  );
}
