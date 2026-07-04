import { useEffect, useRef, useState } from "react";

// Animated number counter — eases from 0 to `value` over `duration` ms.
export function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | undefined>(undefined);
  const from = useRef(0);

  useEffect(() => {
    from.current = 0;
    const start = performance.now();
    cancelAnimationFrame(raf.current ?? 0);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from.current + (value - from.current) * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current ?? 0);
  }, [value, duration]);

  return display;
}
