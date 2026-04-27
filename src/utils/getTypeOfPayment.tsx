export function getTypeOfPayment(forma_pagamento?: string) {
  if (!forma_pagamento) return "-";
  if (forma_pagamento === "fatura vivo+cartao credito") {
    return "Fatura Vivo + Cartão de Crédito";
  } else if (forma_pagamento === "cartao credito") {
    return "Cartão de Crédito";
  } else if (forma_pagamento === "fatura vivo") {
    return "Fatura Vivo";
  }
  return forma_pagamento;
}
