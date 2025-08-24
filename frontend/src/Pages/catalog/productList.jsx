
import React, { useCallback, useMemo, useState } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../features/product/productApi';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import ProductCard from '../../components/product/ProductCard';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';

export default function ProductList() {
  const [filters, setFilters] = useState({ page: 1, limit: 12, q: '', category: '', brand: '', minPrice: '', maxPrice: '' });
  const { data, isFetching } = useGetProductsQuery(filters);
  const { data: categories = [] } = useGetCategoriesQuery();
  const items = data?.items || [];
  const hasMore = data?.hasMore;

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) setFilters((f) => ({ ...f, page: f.page + 1 }));
  }, [isFetching, hasMore]);
  const sentinelRef = useInfiniteScroll(loadMore, hasMore);

  // mobile filters modal
  const [open, setOpen] = useState(false);

  const applyFilter = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 }); // reset pagination
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Services & Products</h1>
        <button className="btn btn-ghost md:hidden" onClick={()=>setOpen(true)}>
          <FunnelIcon className="w-5 h-5" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block md:col-span-3">
          <FilterPanel categories={categories} filters={filters} apply={applyFilter} />
        </aside>

        {/* Grid */}
        <section className="md:col-span-9">
          <div className="form-control mb-4">
            <input
              className="input input-bordered"
              placeholder="Search for cleaning, salon, appliances..."
              value={filters.q}
              onChange={(e)=>applyFilter('q', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {isFetching && <div className="flex justify-center py-6"><span className="loading loading-dots" /></div>}
          <div ref={sentinelRef} className="h-2" />
        </section>
      </div>

      {/* Mobile Filters */}
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 p-4 flex justify-end">
          <Dialog.Panel className="w-full max-w-xs bg-base-100 p-4">
            <FilterPanel categories={categories} filters={filters} apply={applyFilter} onClose={()=>setOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

function FilterPanel({ categories, filters, apply, onClose }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Filters</h3>
      <div>
        <label className="label">Category</label>
        <select className="select select-bordered w-full" value={filters.category} onChange={(e)=>apply('category', e.target.value)}>
          <option value="">All</option>
          {categories?.map((c)=> <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input className="input input-bordered" placeholder="Min Price" value={filters.minPrice} onChange={(e)=>apply('minPrice', e.target.value)} />
        <input className="input input-bordered" placeholder="Max Price" value={filters.maxPrice} onChange={(e)=>apply('maxPrice', e.target.value)} />
      </div>
      {onClose && <button className="btn btn-primary w-full" onClick={onClose}>Apply</button>}
    </div>
  );
}