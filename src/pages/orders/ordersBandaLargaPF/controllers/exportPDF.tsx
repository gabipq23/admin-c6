import { OrderC6Bank } from "@/interfaces/orders";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatCPF } from "@/utils/formatCPF";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.vfs;

const getBase64FromImageUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Erro ao criar contexto do canvas");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject("Erro ao carregar imagem");
    img.src = url;
  });
};

const boolLabel = (value: boolean | null | undefined): string =>
  value === true ? "Sim" : value === null || value === undefined ? "-" : "Não";

const dateLabel = (value: string | null | undefined): string => {
  if (!value) return "-";

  // Se já vier no formato brasileiro (DD/MM/YYYY...), exibe direto
  if (/^\d{2}\/\d{2}\/\d{4}/.test(value)) {
    return value;
  }

  // Tenta parsear ISO ou outros formatos
  const normalized = value.replace(" ", "T");
  const date = new Date(normalized);
  if (!isNaN(date.getTime())) {
    return date.toLocaleString("pt-BR");
  }

  return value;
};
const currencyLabel = (value: number | null | undefined): string =>
  value == null
    ? "-"
    : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const generatePDF = async (order: OrderC6Bank | undefined) => {
  if (!order) return;

  const logo = await getBase64FromImageUrl("/assets/c6-logo.png");

  const docDefinition = {
    pageMargins: [20, 40, 20, 40],
    content: [
      // Cabeçalho
      {
        columns: [
          {
            image: logo,
            width: 100,
            alignment: "left",
            margin: [0, 10, 0, 0],
          },
          { text: "", width: "*" },
        ],
        margin: [0, 5, 0, 10] as [number, number, number, number],
      },

      // Título
      {
        text: `Pedido Nº${order.order_number || order.id}`,
        style: "title",
      },

      // Informações Pessoais
      { text: "Informações Pessoais", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Nome Completo: ${order.full_name || "-"}`,
          `CPF: ${formatCPF(order.cpf) || "-"}`,
          `Email: ${order.email || "-"}`,
          `Telefone: ${formatPhoneNumber(order.phone) || "-"}`,
        ],
        style: "content",
      },

      // Informações Empresariais
      { text: "Informações Empresariais", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `CNPJ: ${formatCNPJ(order.cnpj || "") || "-"}`,
          `Razão Social: ${order.company_legal_name || "-"}`,
          `Sócio: ${boolLabel(order.is_socio)}`,
          `MEI: ${boolLabel(order.is_mei)}`,
        ],
        style: "content",
      },

      // Produtos de Interesse
      { text: "Produtos de Interesse", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Abertura de Conta: ${boolLabel(order.product_account_opening)}`,
          `Maquininha: ${boolLabel(order.product_card_machine)}`,
          `Cartão de Crédito: ${boolLabel(order.product_credit_card)}`,
          `Empréstimo: ${boolLabel(order.product_loan)}`,
          `Valor do Empréstimo: ${currencyLabel(order.loan_amount)}`,
        ],
        style: "content",
      },

      // App C6 Bank
      { text: "App C6 Bank", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Click App: ${boolLabel(order.app_click)}`,
          `Data/Hora Click: ${dateLabel(order.app_click_at)}`,
          `Cadastro App: ${boolLabel(order.app_register)}`,
          `Data/Hora Cadastro: ${dateLabel(order.app_register_at)}`,
        ],
        style: "content",
      },

      // Consultor
      { text: "Informações de Atendimento", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Consultor: ${order.responsible_consultant || "-"}`,
          `Equipe: ${order.team || "-"}`,
          `Observação: ${order.consultant_observation || "-"}`,
          `Notas: ${order.consultant_notes || "-"}`,
        ],
        style: "content",
      },

      // Dados do Pedido
      { text: "Dados do Pedido", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Status: ${order.status || "-"}`,
          `Tipo: ${order.order_type || "-"}`,
          `Criado em: ${dateLabel(order.created_at)}`,
        ],
        style: "content",
      },
    ],
    styles: {
      title: {
        fontSize: 18,
        bold: true,
        color: "#333",
        marginBottom: 12,
        alignment: "center" as const,
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: "#444",
        margin: [0, 15, 0, 8] as [number, number, number, number],
      },
      content: {
        fontSize: 11,
        color: "#555",
        marginBottom: 3,
        lineHeight: 1.3,
      },
    },
  };

  pdfMake
    .createPdf(docDefinition as any)
    .download(`pedido-c6bank-${order.order_number || order.id}.pdf`);
};