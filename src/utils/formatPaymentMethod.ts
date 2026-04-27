export const formatPaymentMethod = (method?: string | null) => {
  if (!method) return "-";

  const paymentMethodLabels: Record<string, string> = {
    automatic_debit: "Debito Automatico",
    credit_card: "Cartao de Credito",
    boleto: "Boleto",
    pix: "PIX",
  };

  return paymentMethodLabels[method] || method;
};
