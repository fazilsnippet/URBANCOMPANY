
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../features/product/productApi';
import { useDispatch } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';
import Reviews from '../../components/product/Reviews';
import { price } from '../../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, isFetching } = useGetProductByIdQuery(id);
  const dispatch = useDispatch();

  if (isFetching) return <div className="flex justify-center p-10"><span className="loading loading-dots" /></div>;
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          {/* Mobile: simple swipeable area */}
          <div className="lg:hidden carousel w-full space-x-2">
            {product.images.map((src, idx)=>(
              <div key={idx} className="carousel-item w-full">
                <img src={src} alt={product.name} className="w-full rounded-lg" />
              </div>
            ))}
          </div>

          {/* Desktop: sticky image area */}
          <div className="hidden lg:block sticky top-24 space-y-3">
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((src, i)=>(
                <img key={i} src={src} alt="" className="rounded-md object-cover h-24 w-full" />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="mt-2 text-sm text-base-content/70">{product.brand}</div>
          <div className="mt-3 text-3xl font-bold">{price(product.price)}</div>
          <p className="mt-4">{product.description}</p>

          <div className="mt-6 flex gap-3">
            <button className="btn btn-primary" onClick={()=>dispatch(addItem({ productId: product.id, price: product.price, name: product.name, thumbnail: product.thumbnail }))}>Add to Cart</button>
          </div>

          <div className="divider" />
          <Reviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}
