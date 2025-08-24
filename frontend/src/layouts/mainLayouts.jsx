import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import { useSelector } from 'react-redux';

export default function MainLayout() {
  const { items } = useSelector((s) => s.cart);
  const count = items.reduce((a,b)=>a+b.quantity,0);
  return (
    <div data-theme="">
      <div className="navbar bg-base-100 border-b">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">UrbanCo</Link>
        </div>
        <div className="flex-none gap-2">
          <NavLink to="/cart" className="btn btn-ghost">
            Cart <div className="badge badge-primary ml-2">{count}</div>
          </NavLink>
          <NavLink to="/wishlist" className="btn btn-ghost">Wishlist</NavLink>
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
      <Outlet />
      <footer className="footer footer-center p-6 bg-base-200 mt-10">
        <aside>
          <p>© {new Date().getFullYear()} UrbanCo</p>
        </aside>
      </footer>
    </div>
  );
}

function UserMenu() {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <NavLink to="/login" className="btn btn-primary">Login</NavLink>;
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost avatar">
        <div className="w-8 rounded-full">
          <img src={user.avatar || 'https://placehold.co/32'} />
        </div>
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li><NavLink to="/profile">Profile</NavLink></li>
        <li><NavLink to="/addresses">Addresses</NavLink></li>
        {user.role === 'PARTNER' && <li><NavLink to="/partner">Partner Dashboard</NavLink></li>}
        {user.role === 'ADMIN' && <li><NavLink to="/admin">Admin</NavLink></li>}
        <li><NavLink to="/orders">Orders</NavLink></li>
        <li><LogoutItem /></li>
      </ul>
    </div>
  );
}

import { useLogoutMutation } from '../features/auth/authApi';
function LogoutItem() {
  const [logout] = useLogoutMutation();
  return <button onClick={()=>logout()}>Logout</button>;
}