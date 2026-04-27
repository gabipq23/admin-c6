export function formatCEP(cep: string) {
  if (!cep) return "";
  return cep
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}
// xxxxx-xxx
