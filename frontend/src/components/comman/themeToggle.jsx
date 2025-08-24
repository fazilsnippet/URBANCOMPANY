
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <label className="swap swap-rotate">
      <input type="checkbox" checked={dark} onChange={(e)=>setDark(e.target.checked)} />
      <svg className="swap-on fill-current w-6 h-6" viewBox="0 0 24 24"><path d="M5.64 17.657A9 9 0 0018.364 4.93a9 9..." /></svg>
      <svg className="swap-off fill-current w-6 h-6" viewBox="0 0 24 24"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84..." /></svg>
    </label>
  );
}
