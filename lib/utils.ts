type ClassValue = string | number | null | undefined | false | ClassValue[];

/** Junta nomes de classes CSS, ignorando valores falsy. */
export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((value): value is string | number => Boolean(value))
    .join(" ");
}

/** Converte um texto em slug (ex: "Loja da Maria" -> "loja-da-maria"). */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Formata um valor numérico como moeda brasileira (ex: 1500 -> "R$ 1.500,00"). */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
