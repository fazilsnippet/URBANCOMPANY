import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import WishlistButton from '../common/WishlistButton';
import { price } from '../../utils/format';

export default function ProductCard({ product }) {
  return (
    <div className="card bg-base-200 hover:shadow-lg transition">
      <figure className="aspect-square overflow-hidden">
        <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
      </figure>
      <div className="card-body">
        <Link to={`/products/${product.id}`} className="card-title line-clamp-1">{product.name}</Link>
        <p className="text-sm text-base-content/70 line-clamp-2">{product.shortDescription}</p>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{price(product.price)}</div>
          <WishlistButton productId={product.id} />
        </div>
        <div className="card-actions">
          <Link to={`/products/${product.id}`} className="btn btn-primary btn-block">View</Link>
        </div>
      </div>
    </div>
  );
}