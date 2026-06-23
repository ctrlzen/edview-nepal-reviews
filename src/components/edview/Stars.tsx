import { Star } from "lucide-react";

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={filled ? "fill-warm text-warm" : "text-border"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
}

export function RatingPill({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
      <Star className="h-3 w-3 fill-current" strokeWidth={0} />
      {value.toFixed(1)}
    </span>
  );
}
