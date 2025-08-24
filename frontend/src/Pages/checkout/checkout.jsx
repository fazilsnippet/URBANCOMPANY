import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAddressesQuery } from '../../features/user/userApi';
import { useCreateOrderMutation, useCreateRazorpayOrderMutation, useVerifyRazorpayMutation } from '../../features/order/orderApi';
import { clearCart } from '../../features/cart/cartSlice';
import { loadRazorpay } from '../../services/razorpay';
import { toast } from 'react-hot-toast';
import { price } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items } = useSelector((s) => s.cart);
  const { data: addresses = [] } = useGetAddressesQuery();
  const [addressId, setAddressId] = useState(addresses.find(a=>a.isDefault)?.id);
  const [method, setMethod] = useState('COD'); // COD | RAZORPAY | UPI
  const [createOrder] = useCreateOrderMutation();
  const [createRzOrder] = useCreateRazorpayOrderMutation();
  const [verifyRz] = useVerifyRazorpayMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = useMemo(() => items.reduce((sum, it)=> sum + it.price * it.quantity, 0), [items]);

  const placeOrder = async () => {
    if (!items.length) return toast.error('Cart is empty');
    if (!addressId) return toast.error('Select an address');

    if (method === 'COD') {
      const res = await createOrder({ items, addressId, paymentMethod: 'COD' });
      if ('data' in res) {
        dispatch(clearCart());
        toast.success('Order placed');
        navigate('/orders');
      }
      return;
    }

    if (method === 'RAZORPAY') {
      const ok = await loadRazorpay();
      if (!ok) return toast.error('Razorpay SDK failed to load');

      const rp = await createRzOrder(Math.round(total * 100)); // in paise
      if (!('data' in rp)) return;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rp.data.amount,
        currency: rp.data.currency || 'INR',
        order_id: rp.data.id,
        name: 'UrbanCo',
        description: 'Order Payment',
        handler: async (response) => {
          const verify = await verifyRz(response);
          if ('data' in verify) {
            const res = await createOrder({
              items, addressId, paymentMethod: 'RAZORPAY', paymentMeta: response
            });
            if ('data' in res) {
              dispatch(clearCart());
              toast.success('Payment successful');
              navigate('/orders');
            }
          }
        },
        prefill: {},
        theme: { color: '#0ea5e9' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }

    if (method === 'UPI') {
      // If backend provides UPI intent/QR
      const res = await createOrder({ items, addressId, paymentMethod: 'UPI' });
      if ('data' in res) {
        dispatch(clearCart());
        toast.success('UPI order placed');
        navigate('/orders');
      }
    }
  };

  // If no addresses, show empty-state with CTA to create
  const hasAddress = addresses.length > 0;

  return (
    <div className="container mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Delivery Address</h2>
            {!hasAddress ? (
              <div className="text-sm">
                No addresses found. Please add one from the Addresses page before checkout.
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((a)=>(
                  <label key={a.id} className="flex items-start gap-3 cursor-pointer">
                    <input type="radio" className="radio radio-primary" checked={addressId===a.id} onChange={()=>setAddressId(a.id)} />
                    <div>
                      <div className="font-medium">{a.name} {a.isDefault && <span className="badge badge-primary ml-2">Default</span>}</div>
                      <div className="text-sm">{a.line1}, {a.city}, {a.state} {a.zip}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Payment</h2>
            <div className="flex flex-col gap-2">
              {['COD', 'RAZORPAY', 'UPI'].map((m)=>(
                <label key={m} className="flex gap-3 items-center">
                  <input type="radio" className="radio" checked={method===m} onChange={()=>setMethod(m)} />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Order Summary</h2>
            <ul className="divide-y divide-base-300">
              {items.map((it)=>(
                <li key={it.productId} className="py-2 flex justify-between">
                  <span>{it.name} × {it.quantity}</span>
                  <span>{price(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{price(total)}</span>
            </div>
            <button className="btn btn-primary mt-4 w-full" onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}