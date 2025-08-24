import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../../features/wishlist/wishlistApi';
import { useGetWishlistQuery } from '../../features/wishlist/wishlistApi';

export default function WishlistButton({ productId }) {
  const { data: list = [] } = useGetWishlistQuery();
  const [add] = useAddToWishlistMutation();
  const [remove] = useRemoveFromWishlistMutation();
  const isWish = list.some((w) => w.productId === productId);

  const toggle = () => (isWish ? remove(productId) : add(productId));

  return (
    <button className={`btn btn-ghost btn-circle ${isWish ? 'text-red-500' : ''}`} onClick={toggle} title="Toggle wishlist">
      <HeartIcon className="w-6 h-6" />
    </button>
  );
}