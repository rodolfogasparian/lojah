"use client";
type Category = { id: string; label: string };
type Props = { categories: Category[]; active: string; onChange: (id: string) => void };

export function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div>
      <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-1 block">
        Encontre o produto por categoria
      </label>
      <select
        value={active}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-primary rounded-lg px-3 py-2 bg-white text-foreground font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
    </div>
  );
}
