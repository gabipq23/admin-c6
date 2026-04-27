import { formatPhoneNumber } from "./format_number";

const phones = new Set(["numero_wa", "externalId"]);

const dates = new Set(["lastInteraction"]);

const cpf = new Set(["cpf"]);

const cnpj = new Set(["cnpj"]);

const cep = new Set(["cep"]);

export type FieldTypes = "phone" | "date" | "cpf" | "cnpj" | "text" | "cep";

export function getMask(fieldType: FieldTypes, value: string): string {
  switch (fieldType) {
    case "cpf":
      // Aplicando a máscara CPF
      return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    case "cnpj":
      // Aplicando a máscara CNPJ
      return value.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
    case "phone":
      return formatPhoneNumber(value);
    case "cep":
      // Aplicando a máscara CEP
      return value.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    default:
      return value;
  }
}

// Mascaras
export function getFieldType(value: string): FieldTypes {
  if (phones.has(value)) return "phone";
  if (dates.has(value)) return "date";
  if (cpf.has(value)) return "cpf";
  if (cnpj.has(value)) return "cnpj";
  if (cep.has(value)) return "cep";

  return "text";
}
