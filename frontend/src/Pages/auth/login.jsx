
import React, { useState } from 'react';
import { useLoginMutation } from '../../features/auth/authApi';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { state } = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if ('data' in res) {
      navigate(state?.from || '/', { replace: true });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title">Login</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <input className="input input-bordered w-full" placeholder="Email"
              value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
            <input className="input input-bordered w-full" placeholder="Password" type="password"
              value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
            <button className="btn btn-primary w-full" disabled={isLoading}>Sign in</button>
          </form>
          <div className="text-sm mt-2 flex justify-between">
            <Link to="/register" className="link">Create account</Link>
            <Link to="/forgot-password" className="link">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
