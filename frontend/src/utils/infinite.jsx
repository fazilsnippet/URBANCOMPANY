import { useEffect, useRef } from 'react';

export default function useInfiniteScroll(callback, canLoad = true) {
  const ref = useRef(null);
  useEffect(() => {
    if (!canLoad) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) callback();
    }, { threshold: 1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, canLoad]);
  return ref;
}