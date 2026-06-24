import { useState } from "react";
import { Star } from "lucide-react";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function StarRating({ value, onChange, label }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayValue = hovered || value;
  const labelText = displayValue > 0 ? RATING_LABELS[displayValue] : "";

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-xs font-semibold text-muted-foreground">
          {value > 0 ? `${value}/5` : "—"}
          {labelText && <span className="ml-1 text-muted-foreground/70">· {labelText}</span>}
        </span>
      </div>
      <div className="mt-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="group relative flex-1 transition-transform hover:scale-110 active:scale-95"
            aria-label={`Rate ${n} out of 5`}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                n <= displayValue
                  ? "fill-warm text-warm"
                  : "text-border group-hover:text-warm/40"
              }`}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
    </div>
  );
}