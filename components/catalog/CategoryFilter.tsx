"use client";
type Category = { id: string; label: string };
type Props = { categories: Category[]; active: string; onChange: (id: string) => void };

export function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto py-3 -mx-4 px-4 pr-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((c) => (
        <button key={c.id} type="button" onClick={() => onChange(c.id)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-secondary-foreground hover:border-primary/30"}`}>
          {c.label}
        </button>
      ))}
    </div>
  );
}
