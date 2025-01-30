'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CheckOutFormProps {
  userId: string;
  cartItemsLength: number;
}

export default function CheckOutForm({ userId, cartItemsLength }: CheckOutFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: '',
    cardHolder: '',
    cardNumber: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (
      !formData.address.trim() ||
      !formData.cardHolder.trim() ||
      !/^\d{16}$/.test(formData.cardNumber) // Must be 16 digits
    ) {
      setError('Please fill out all fields correctly. Card number must be 16 digits.');
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        // Assuming data.orderId is returned from the POST handler
        router.push(`/orders/${data.orderId}`);
      } else {
        const result = await res.json();
        setError(result.message || 'Failed to create order. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit} noValidate>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Shipping and Payment Information
      </h3>

      {/* Address Input */}
      <div>
        <label
          htmlFor='address'
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Shipping Address
        </label>
        <input
          id='address'
          name='address'
          type='text'
          required
          value={formData.address}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      {/* Card Holder and Card Number Inputs */}
      <div className='md:flex md:space-x-4'>
        <div className='md:flex-1'>
          <label
            htmlFor='cardHolder'
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Card Holder
          </label>
          <input
            id='cardHolder'
            name='cardHolder'
            type='text'
            required
            value={formData.cardHolder}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className='mt-4 md:mt-0 md:flex-1'>
          <label
            htmlFor='cardNumber'
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Card Number
          </label>
          <input
            id='cardNumber'
            name='cardNumber'
            type='text'
            required
            maxLength={16}
            pattern='\d{16}'
            value={formData.cardNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <button
        type='submit'
        disabled={!cartItemsLength}
        className={`w-full rounded-md px-4 py-2 font-medium text-white shadow-sm ${
          cartItemsLength
          ? 'bg-green-700 hover:bg-green-600 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600'
          : 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
        }`}
      >
        Purchase
      </button>
    </form>
  );
}
