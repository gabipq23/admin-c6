export function convertData(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(date));
}
// dd/mm/yyyy hh:mm:ss
