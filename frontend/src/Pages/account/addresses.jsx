import React, { useState } from 'react';
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from '../../features/user/userApi';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';

export default function Addresses() {
  const { data: addresses = [], isFetching } = useGetAddressesQuery();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefault] = useSetDefaultAddressMutation();
  const [form, setForm] = useState({ name: '', line1: '', line2: '', city: '', state: '', zip: '', phone: '' });

  const openModal = (addr) => {
    setEditing(addr || null);
    setForm(addr || { name: '', line1: '', line2: '', city: '', state: '', zip: '', phone: '' });
    setOpen(true);
  };

  const save = async () => {
    const res = editing ? await updateAddress({ id: editing.id, ...form }) : await addAddress(form);
    if ('data' in res) {
      toast.success('Saved');
      setOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Addresses</h2>
        <button className="btn btn-primary" onClick={() => openModal(null)}>Add Address</button>
      </div>
      {isFetching && <div className="loading loading-dots" />}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((a) => (
          <div key={a.id} className="card bg-base-200">
            <div className="card-body">
              <div className="flex justify-between">
                <h3 className="font-semibold">{a.name}</h3>
                {a.isDefault && <span className="badge badge-primary">Default</span>}
              </div>
              <p>{a.line1}, {a.line2}</p>
              <p>{a.city}, {a.state} {a.zip}</p>
              <p>📞 {a.phone}</p>
              <div className="card-actions justify-end">
                {!a.isDefault && <button className="btn btn-ghost" onClick={()=>setDefault(a.id)}>Set default</button>}
                <button className="btn btn-ghost" onClick={()=>openModal(a)}>Edit</button>
                <button className="btn btn-error" onClick={()=>deleteAddress(a.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onClose={()=>setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg card bg-base-200 p-6">
            <Dialog.Title className="text-lg font-semibold">{editing ? 'Edit Address' : 'Add Address'}</Dialog.Title>
            <div className="grid grid-cols-1 gap-2 mt-3">
              {['name','line1','line2','city','state','zip','phone'].map((k)=>(
                <input key={k} className="input input-bordered w-full" placeholder={k}
                  value={form[k] || ''} onChange={(e)=>setForm({...form, [k]: e.target.value})} />
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}