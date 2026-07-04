import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { SEARCH_PLACEHOLDERS, aiSearch, COLLEGES } from "@/lib/edview-data";

export function AiSearchBar({ size = "lg" }: { size?: "lg" | "md" }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [phIndex, setPhIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const blurTimer = useRef<number | undefined>(undefined);

  // Rotate placeholder every 3s when empty & unfocused
  useEffect(() => {
    if (value || focused) return;
    const id = window.setInterval(() => setPhIndex((i) => (i + 1) % SEARCH_PLACEHOLDERS.length), 3000);
    return () => clearInterval(id);
  }, [value, focused]);

  // Autocomplete: top college names + intent phrases matching the query
  useEffect(() => {
    if (!value.trim() || value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const q = value.trim().toLowerCase();
    const fromColleges = COLLEGES.filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => c.name);
    const fromIntents = [
      "Best academics", "Good BCA college", "Affordable colleges", "Friendly teachers",
      "Good campus life", "Best placements", "Colleges for BBA", "Science colleges",
    ].filter((p) => p.toLowerCase().includes(q));
    setSuggestions([...new Set([...fromColleges, ...fromIntents])].slice(0, 5));
  }, [value]);

  function submit(q?: string) {
    const query = (q ?? value).trim();
    if (!query) return;
    navigate({ to: "/search", search: { q: query } });
    setValue(query);
    setFocused(false);
  }

  const h = size === "lg" ? "h-14" : "h-12";
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="relative w-full">
      <div className={`flex items-center gap-3 rounded-full border border-border bg-card ${h} px-5 shadow-elevated transition focus-within:border-brand`}>
        <Sparkles className={`${iconSize} flex-none text-brand`} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { blurTimer.current = window.setTimeout(() => setFocused(false), 150); }}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder={SEARCH_PLACEHOLDERS[phIndex]}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground md:text-base"
          aria-label="AI search"
        />
        <button
          onClick={() => submit()}
          className="inline-flex flex-none items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:bg-foreground/90"
        >
          <Search className="h-3.5 w-3.5" /> Search
        </button>
      </div>

      {focused && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          {suggestions.map((s) => (
            <button
              key={s}
              onMouseDown={(e) => { e.preventDefault(); submit(s); }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-muted"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              {s}
              <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Lightweight version for inline use (no autocomplete dropdown)
export function AiSearchBarInline() {
  return <AiSearchBar size="md" />;
}

void aiSearch;
