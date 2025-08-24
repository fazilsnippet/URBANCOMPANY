
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateProfileMutation } from '../../features/user/userApi';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [name, setName] = useState(user?.name || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onSave = async () => {
    const fd = new FormData();
    fd.append('name', name);
    if (file) fd.append('avatar', file);
    const res = await updateProfile(fd);
    if ('data' in res) toast.success('Profile updated');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="card bg-base-200">
        <div className="card-body">
          <h2 className="card-title">Profile</h2>
          <div className="flex gap-6 items-center">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={preview || 'https://placehold.co/96'} alt="avatar" />
              </div>
            </div>
            <div className="space-y-3 w-full max-w-md">
              <input className="input input-bordered w-full" value={name} onChange={(e)=>setName(e.target.value)} />
              <input type="file" className="file-input file-input-bordered w-full" onChange={onFile} accept="image/*" />
              <button className="btn btn-primary" onClick={onSave} disabled={isLoading}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
