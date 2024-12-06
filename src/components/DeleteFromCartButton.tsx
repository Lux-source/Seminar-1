'use client';

interface DeleteFromCartButtonProps {
  userId: string;
  productId: string;
  onDeleteSuccess?: () => void; // Callback opcional para manejar la actualización tras eliminar
}

export default function DeleteFromCartButton({ userId, productId, onDeleteSuccess }: DeleteFromCartButtonProps) {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Product removed from cart successfully!');
        onDeleteSuccess?.(); // Llama al callback si se proporciona (e.g., para refrescar el carrito)
      } else {
        const data = await response.json();
        alert(`Failed to remove product: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting product from cart:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-outline  btn-error dark:border-red-500 dark:text-red-500 group-hover:scale-105 transition-transform duration-300"
    >
      Delete
    </button>
  );
}
