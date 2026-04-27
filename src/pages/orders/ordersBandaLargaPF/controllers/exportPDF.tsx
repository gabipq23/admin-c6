
import { OrderBandaLarga } from "@/interfaces/orders";
import { formatBRL } from "@/utils/formatBRL";
import { formatCEP } from "@/utils/formatCEP";
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
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = () => reject("Erro ao carregar imagem");
    img.src = url;
  });
};

export const generatePDF = async (order: OrderBandaLarga | undefined) => {
  if (!order) return;

  const addressComplement = order.address_complement;
  const buildingOrHouse =
    addressComplement?.building_or_house || order.building_or_house;
  const complementoEndereco =
    buildingOrHouse === "house"
      ? addressComplement?.home_complement || "-"
      : buildingOrHouse === "building"
        ? `${addressComplement?.unit_type || "-"} ${addressComplement?.unit_number || "-"
          }`.trim()
        : "-";
  const lote = addressComplement?.lot || order.address_lot || "-";
  const quadra =
    addressComplement?.square || addressComplement?.block || order.address_block || "-";
  const andar = addressComplement?.floor || order.address_floor || "-";
  const tipoImovel =
    buildingOrHouse === "building"
      ? "Edifício"
      : buildingOrHouse === "house"
        ? "Casa"
        : "-";
  const pontoReferencia =
    addressComplement?.reference_point || order.address_reference_point || "-";

  const paymentMethodLabel =
    order.payment_method === "automatic_debit"
      ? "Debito Automatico"
      : order.payment_method === "credit_card"
        ? "Cartao de Credito"
        : order.payment_method === "boleto"
          ? "Boleto"
          : order.payment_method === "pix"
            ? "PIX"
            : order.payment_method || "-";

  const logo = await getBase64FromImageUrl("/assets/tim.svg");

  const docDefinition = {
    pageMargins: [20, 40, 20, 40],
    content: [
      // Cabeçalho com logos
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

      // Título do pedido
      {
        columns: [
          {
            text: `Pedido Nº${order.order_number || order.id}`,
            style: "title",
          },
        ],
      },

      // Plano Contratado
      { text: "Plano Contratado", style: "sectionHeader" },
      {
        table: {
          headerRows: 1,
          widths: ["*", 100],
          body: [
            [
              { text: "Plano", style: "tableHeader" },

              { text: "Valor Mensal", style: "tableHeader" },
            ],
            [
              { text: order.plan?.name || "-", style: "tableBody" },

              {
                text: formatBRL(order.price_summary?.plan_price ?? order.plan?.value ?? 0),
                style: "tableBody",
              },
            ],
          ],
        },
        layout: "lightHorizontalLines",
        style: "productTable",
      },

      {
        type: "circle",
        ul: [
          `Possui Disponibilidade?  ${order.availability
            ? "Sim"
            : order.availability === null
              ? "-"
              : "Não"
          }`,
        ],
        style: "content",
      },
      {
        type: "circle",
        ul: [
          `Possui Disponibilidade PAP?  ${order.availability_pap
            ? "Sim"
            : order.availability_pap === null
              ? "-"
              : "Não"
          }`,
        ],
        style: "content",
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
          `Telefone Adicional: ${formatPhoneNumber(order.additional_phone || "") || "-"}`,

          `Data de Nascimento: ${order.birth_date || "-"}`,
          `Nome da Mãe: ${order.mother_full_name || "-"}`,
        ],
        style: "content",
      },

      // Endereço
      { text: "Informações de Endereço", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `CEP: ${formatCEP(order.zip_code || "") || "-"}`,
          `Endereço: ${order.address || "-"}`,
          `Número: ${order.address_number || "-"}`,
          `Complemento: ${complementoEndereco}`,
          `Lote: ${lote}`,
          `Quadra: ${quadra}`,
          `Andar: ${andar}`,
          `Tipo: ${tipoImovel}`,
          `Ponto de referência: ${pontoReferencia}`,
          `Bairro: ${order.district || "-"}`,
          `Cidade: ${order.city || "-"}`,
          `UF: ${order.state || "-"}`,
        ],
        style: "content",
      },

      // Preferências de Instalação
      { text: "Preferências de Instalação", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Data Preferida 1: ${order.installation_preferred_date_one}`,
          `Período Preferido 1: ${order.installation_preferred_period_one || "-"
          }`,
          `Data Preferida 2: ${order.installation_preferred_date_two}`,
          `Período Preferido 2: ${order.installation_preferred_period_two || "-"
          }`,
          `Dia de Vencimento: ${order.due_day ?? "-"}`,
        ],
        style: "content",
      },

      // Informacoes de Pagamento
      { text: "Informações de Pagamento", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Metodo de Pagamento: ${paymentMethodLabel}`,
          `Nome do Banco: ${order.bank_name || "-"}`,
          `Agencia: ${order.bank_branch || "-"}`,
          `Numero da Conta: ${order.bank_account_number || "-"}`,
        ],
        style: "content",
      },

      // Resumo Financeiro
      { text: "Resumo Financeiro", style: "sectionHeader" },
      {
        columns: [
          { text: "Valor Mensal do Plano", style: "content" },
          {
            text: formatBRL(order.price_summary?.plan_price ?? order.plan?.value ?? 0),
            style: "content",
            alignment: "right",
          },
        ],
      },


    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "#222",
        fillColor: "#f3f3f3",
        margin: [0, 4, 0, 4],
      },
      tableBody: {
        fontSize: 9,
        color: "#444",
        margin: [0, 2, 0, 2],
      },
      productTable: {
        margin: [0, 5, 0, 15],
      },
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
      footer: {
        alignment: "center" as const,
        italics: true,
        fontSize: 12,
        color: "#333",
      },
    },
  };

  pdfMake
    .createPdf(docDefinition as any)
    .download(`pedido-banda-larga-pf-${order.order_number || order.id}.pdf`);
};
