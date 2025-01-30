'use client';

interface AddToCartButtonProps {
  productId: string;
  userId: string;
  quantity: number; // Cantidad obtenida del estado compartido
}

export default function AddToCartButton({ productId, userId, quantity }: AddToCartButtonProps) {
  const handleAddToCart = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          qty: quantity, // Usamos la cantidad proporcionada por la prop
        }),
      });

      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        alert('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="mt-4 w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-green-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 transition duration-300"
    >
      Add to Cart
    </button>
  );
}
