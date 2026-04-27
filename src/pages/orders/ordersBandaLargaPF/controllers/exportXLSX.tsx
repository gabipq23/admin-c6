import { OrderBandaLarga } from "@/interfaces/orders";
import { formatBRL } from "@/utils/formatBRL";

import * as XLSX from "xlsx";

const getNestedValue = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce((acc: unknown, prop: string) => {
    if (acc && typeof acc === "object" && prop in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[prop];
    }
    return undefined;
  }, obj);
};

const getFlatValue = (obj: unknown, key: string): unknown => {
  return (obj as unknown as Record<string, unknown>)[key];
};

const getAddressComplementObject = (
  value: unknown,
): OrderBandaLarga["address_complement"] | null => {
  if (!value || typeof value !== "object") return null;
  return value as OrderBandaLarga["address_complement"];
};

const toYesNo = (value: unknown): string => {
  if (value === null || value === undefined) return "-";
  return value === true || value === 1 ? "Sim" : "Nao";
};

const formatPaymentMethod = (method?: string | null): string => {
  if (!method) return "-";

  const labels: Record<string, string> = {
    automatic_debit: "Debito Automatico",
    credit_card: "Cartao de Credito",
    boleto: "Boleto",
    pix: "PIX",
  };

  return labels[method] || method;
};

export const handleExportXLSX = (
  data: OrderBandaLarga[] | undefined,
  selectedRowKeys: Array<string | number> | undefined,
) => {
  if (!data || !selectedRowKeys || selectedRowKeys.length === 0) {
    return;
  }

  const pedidosSelecionados = data.filter((item) =>
    selectedRowKeys.includes(item.id),
  );

  if (!pedidosSelecionados || pedidosSelecionados.length === 0) {
    return;
  }

  const camposMonetarios = ["plan.price", "plan.value", "credit"];
  const camposDataHora = [
    "created_at",
    "updated_at",
    "birth_date",
    "rfb_birth_date",
    "installation_preferred_date_one",
    "installation_preferred_date_two",
    "installation_preferred_date_three",
    "portability_date",
    "additional_portability_date",
    "geolocation.queried_at",
  ];

  const ordemColunas = [
    "order_number",
    "created_at",

    "status",
    "after_sales_status",
    "consultant_observation",
    "full_name",
    "cpf",
    "rfb_name",
    "rfb_birth_date",
    "rfb_gender",
    "mother_full_name",
    "rfb_mother_name",
    "phone",
    "additional_phone",
    "phone_valid",
    "additional_phone_valid",
    "operator",
    "additional_operator",
    "portabilidade",
    "portability_date",
    "additional_portability",
    "additional_portability_date",
    "email",
    "birth_date",
    "plan.name",
    "plan.value",
    "availability",
    "availability_pap",
    "zip_code",
    "single_zip_code",
    "found_via_range",
    "range_min",
    "range_max",
    "address",
    "address_number",
    "address_complement",
    "address_lot",
    "address_block",
    "address_floor",
    "building_or_house",
    "address_reference_point",
    "district",
    "city",
    "state",
    "due_day",
    "payment_method",
    "bank_name",
    "bank_branch",
    "bank_account_number",
    "installation_preferred_date_one",
    "installation_preferred_date_two",
    "installation_preferred_date_three",
    "installation_preferred_period_one",
    "installation_preferred_period_two",
    "installation_preferred_period_three",
    "client_type",
    "credit",
    "debit",
    "company_partners",
    "is_mei",
    "is_socio",
    "responsible_consultant",
    "crm_id",
    "team",
    "url",
    "client_ip",
    "ip_isp",

    "ip_access_type",
    "service",
    "installation",
    "pf_temperature",
    "fingerprint_id",
    "whatsapp.numero",
    "whatsapp.is_comercial",
    "whatsapp.recado",
    "whatsapp.existe_no_whatsapp",
    "geolocation.latitude",
    "geolocation.longitude",
    "geolocation.maps_link",
    "geolocation.street_view_link",
  ];

  const colNames: Record<string, string> = {
    order_number: "Numero do Pedido",
    created_at: "Data de Criação",

    status: "Status",
    after_sales_status: "Status Pos-Venda",
    consultant_observation: "Observacao do Consultor",
    full_name: "Nome Completo",
    cpf: "CPF",
    rfb_name: "Nome na Receita",
    rfb_birth_date: "Nascimento na Receita",
    rfb_gender: "Genero na Receita",
    mother_full_name: "Nome da Mae",
    rfb_mother_name: "Nome da Mae na Receita",
    phone: "Telefone",
    additional_phone: "Telefone Adicional",
    phone_valid: "Telefone Valido",
    additional_phone_valid: "Telefone Adicional Valido",
    operator: "Operadora",
    additional_operator: "Operadora Adicional",
    portabilidade: "Portabilidade",
    portability_date: "Data Portabilidade",
    additional_portability: "Portabilidade Adicional",
    additional_portability_date: "Data Portabilidade Adicional",
    email: "E-mail",
    birth_date: "Data de Nascimento",
    zip_code: "CEP",
    address: "Endereço",
    address_number: "Numero",
    address_complement: "Complemento",
    address_lot: "Lote",
    address_block: "Quadra",
    address_floor: "Andar",
    building_or_house: "Tipo",
    address_reference_point: "Ponto de referência",
    district: "Bairro",
    city: "Cidade",
    state: "UF",
    "plan.name": "Nome do Plano",


    "plan.value": "Valor do Plano",
    installation_preferred_date_one: "Data Preferida 1",
    installation_preferred_date_two: "Data Preferida 2",
    installation_preferred_date_three: "Data Preferida 3",
    installation_preferred_period_one: "Período Preferido 1",
    installation_preferred_period_two: "Período Preferido 2",
    installation_preferred_period_three: "Periodo Preferido 3",
    due_day: "Dia de Vencimento",
    payment_method: "Metodo de Pagamento",
    bank_name: "Nome do Banco",
    bank_branch: "Agencia",
    bank_account_number: "Numero da Conta",
    client_type: "Tipo de Cliente",
    credit: "Credito",
    debit: "Debito",
    company_partners: "Empresas",
    is_mei: "É MEI",
    is_socio: "E Socio",

    url: "URL",
    crm_id: "ID CRM",
    responsible_consultant: "Consultor Responsavel",
    team: "Equipe",
    client_ip: "IP do Cliente",
    ip_isp: "IP ISP",

    ip_access_type: "Tipo de Acesso IP",
    service: "Atendimento",
    installation: "Instalacao",
    pf_temperature: "Temperatura PF",
    fingerprint_id: "Fingerprint ID",
    availability: "Disponibilidade",
    availability_pap: "Disponibilidade PAP",
    single_zip_code: "CEP Unico",
    found_via_range: "Encontrado via Range",
    range_min: "Range Mínimo",
    range_max: "Range Máximo",
    "whatsapp.numero": "WhatsApp Número",
    "whatsapp.is_comercial": "WhatsApp Comercial",
    "whatsapp.recado": "WhatsApp Recado",

    "whatsapp.existe_no_whatsapp": "Existe no WhatsApp",
    "geolocation.latitude": "Geolocalizacao Latitude",
    "geolocation.longitude": "Geolocalizacao Longitude",
    "geolocation.maps_link": "Link Google Maps",
    "geolocation.street_view_link": "Link Street View",
    accept_offers: "Aceita Ofertas",
    terms_accepted: "Termos Aceitos",
    is_email_valid: "Email Valido",
    wants_fixed_ip: "Deseja IP Fixo",
    has_fixed_line_portability: "Portabilidade Fixa",
  };

  const pedidosFormatados = pedidosSelecionados.map((pedido) => {
    const linha: Record<string, unknown> = {};
    const addressComplementObj = getAddressComplementObject(
      pedido.address_complement,
    );

    ordemColunas.forEach((key) => {
      const columnName = colNames[key] || key;

      if (key.includes(".")) {
        const valor = getNestedValue(pedido, key);

        if (valor !== undefined) {
          if (camposMonetarios.includes(key)) {
            linha[columnName] = formatBRL(Number(valor));
          } else if (camposDataHora.includes(key)) {
            linha[columnName] = valor;
          } else if (Array.isArray(valor)) {
            linha[columnName] = valor
              .map((item) =>
                typeof item === "object" && item !== null
                  ? Object.values(item).join(" - ")
                  : String(item),
              )
              .join(" | ");
          } else if (typeof valor === "object" && valor !== null) {
            linha[columnName] = JSON.stringify(valor);
          } else {
            linha[columnName] = valor || "";
          }
        } else {
          linha[columnName] = "";
        }
      } else {
        const valor = getFlatValue(pedido, key);

        if (valor !== undefined) {
          if (camposMonetarios.includes(key)) {
            linha[columnName] = formatBRL(Number(valor));
          } else if (camposDataHora.includes(key)) {
            linha[columnName] = valor;
          } else {
            linha[columnName] = valor;
          }
        } else {
          linha[columnName] = "";
        }
      }
    });

    linha[colNames["accept_offers"]] = toYesNo(pedido.accept_offers);
    linha[colNames["terms_accepted"]] = toYesNo(pedido.terms_accepted);
    linha[colNames["is_email_valid"]] = toYesNo(pedido.is_email_valid);
    linha[colNames["payment_method"]] = formatPaymentMethod(
      pedido.payment_method,
    );
    const buildingOrHouse =
      addressComplementObj?.building_or_house || pedido.building_or_house;
    const complementoCasa = addressComplementObj?.home_complement || "-";
    const complementoPredio = [
      addressComplementObj?.unit_type || "-",
      addressComplementObj?.unit_number || "-",
    ]
      .join(" ")
      .trim();

    linha[colNames["address_complement"]] =
      buildingOrHouse === "house"
        ? complementoCasa
        : buildingOrHouse === "building"
          ? complementoPredio
          : "-";
    linha[colNames["address_lot"]] =
      addressComplementObj?.lot || pedido.address_lot || "-";
    linha[colNames["address_block"]] =
      addressComplementObj?.square ||
      addressComplementObj?.block ||
      pedido.address_block ||
      "-";
    linha[colNames["address_floor"]] =
      addressComplementObj?.floor || pedido.address_floor || "-";
    linha[colNames["address_reference_point"]] =
      addressComplementObj?.reference_point || pedido.address_reference_point || "-";
    linha[colNames["building_or_house"]] =
      buildingOrHouse === "building"
        ? "Edificio"
        : buildingOrHouse === "house"
          ? "Casa"
          : "-";
    linha[colNames["availability"]] = toYesNo(pedido.availability);
    linha[colNames["availability_pap"]] = toYesNo(pedido.availability_pap);
    linha[colNames["single_zip_code"]] = toYesNo(pedido.single_zip_code);
    linha[colNames["found_via_range"]] = toYesNo(pedido.found_via_range);
    linha[colNames["wants_fixed_ip"]] = toYesNo(pedido.wants_fixed_ip);
    linha[colNames["has_fixed_line_portability"]] = toYesNo(
      pedido.has_fixed_line_portability,
    );
    linha[colNames["phone_valid"]] = toYesNo(pedido.phone_valid);
    linha[colNames["additional_phone_valid"]] = toYesNo(
      pedido.additional_phone_valid,
    );
    linha[colNames["is_mei"]] = toYesNo(pedido.is_mei);
    linha[colNames["is_socio"]] = toYesNo(pedido.is_socio);
    linha[colNames["whatsapp.existe_no_whatsapp"]] = toYesNo(
      pedido.whatsapp?.existe_no_whatsapp,
    );
    linha[colNames["whatsapp.is_comercial"]] = toYesNo(
      pedido.whatsapp?.is_comercial,
    );


    return linha;
  });

  const pedidoSheet = XLSX.utils.json_to_sheet(pedidosFormatados);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, pedidoSheet, "Pedidos");

  XLSX.writeFile(workbook, `pedidos-selecionados.xlsx`);
};
