export function formatBRL(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  return `R$ ${Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
}

export function parseBRLInput(value?: string | number): number {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const normalized = value
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}
