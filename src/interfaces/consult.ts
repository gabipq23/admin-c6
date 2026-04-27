export interface ICompany {
  id: number;
  company: string;
  order_number: string | null;
  source_order_id: number | null;
  full_name: string;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  additional_phone: string | null;
  birth_date: string | null;
  mother_full_name: string | null;
  client_type: string | null;
  zip_code: string | null;
  address: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_block: string | null;
  address_lot: string | null;
  address_floor: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  building_or_house: string | null;
  cnpj: string | null;
  company_legal_name: string | null;
  installation_preferred_date_one: string | null;
  installation_preferred_period_one: string | null;
  installation_preferred_date_two: string | null;
  installation_preferred_period_two: string | null;
  installation_preferred_date_three: string | null;
  installation_preferred_period_three: string | null;
  payment_method: string | null;
  bank_name: string | null;
  bank_branch: string | null;
  bank_account_number: string | null;
  has_fixed_line_portability: boolean | null;
  fixed_line_number_to_port: string | null;
  wants_fixed_ip: boolean | null;
  phone_valid: boolean | null;
  operator: string | null;
  portability: string | null;
  portability_date: string | null;
  additional_phone_valid: boolean | null;
  additional_operator: string | null;
  additional_portability: string | null;
  additional_portability_date: string | null;
  is_email_valid: boolean | null;
  found_via_range: boolean | null;
  range_min: number | null;
  range_max: number | null;
  zip_code_type: string | null;
  single_zip_code: string | null;
  availability: string | null;
  availability_pap: string | null;
  ip_isp: string | null;
  ip_org: string | null;
  ip_as: string | null;
  ip_access_type: string | null;
  is_socio: boolean | null;
  socios_empresas?: SociosEmpresas[];
  is_mei: boolean | null;
  company_partners: string | null;
  rfb_name: string | null;
  rfb_birth_date: string | null;
  rfb_mother_name: string | null;
  rfb_gender: string | null;
  client_ip: string | null;
  fingerprint: string | null;
  fingerprint_id: string | null;
  whatsapp?: WhatsAppInfo | null;
  geolocation: {
    success: boolean;
    latitude: string | null;
    longitude: string | null;
    maps_link: string | null;
    precision: string | null;
    queried_at: string | null;
    street_view_link: string | null;
    formatted_address: string | null;
  } | null;
  operators_availability: string | null;
  pf_temperature: string | null;
  credit: number | null;
  cpf_second_call: string | null;
  birth_date_second_call: string | null;
  full_name_second_call: string | null;
  mother_full_name_second_call: string | null;
  number_attempts_second_call: number | null;
  corporate_id: number | null;
  responsible_consultant: string | null;
  team: string | null;
  crm_id: string | null;
  consultant_notes: string | null;
  consultant_observation: string | null;
  manager_name: string | null;
  manager: string | null;
  is_consultation: boolean | null;
  is_order: boolean | null;
  consultation_id: number | null;
  order_id: number | null;
  highlight_top: string | null;
  highlight_bottom: string | null;
  url: string | null;
  message: string | null;
  installation: string | null;
  service: string | null;
  created_at: string;
  updated_at: string;
  rfb_status: string;
}

export interface ICompanyResponse {
  success: boolean;
  clients: ICompany[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;

  // Legacy alias kept optional for compatibility.
  limit?: number;
}
export interface ICompanyFilter {
  page: number;
  per_page: number;
  sort?: string | null;
  order?: "asc" | "desc" | null;
  cnpj?: string;
  rfb_status?: string;
  company_legal_name?: string;
  is_mei?: boolean;
  client_type?: string;
  credit_min?: number;
  credit_max?: number;
  cpf?: string;
}

export interface stateRecomendation {
  recomendacao: string;
  conta_cobranca: string;
  tipo_recomendacao: string;
  oferta: string;
  plano: string;
  valor_recomendacao: string;
  valor_oferta_movel: string;
}

export interface WhatsAppInfo {
  links: string[];
  avatar: string | null;
  numero: string | null;
  recado: string;
  sucesso: boolean;
  endereco: string | null;
  categoria: string;
  is_comercial: boolean;
  verificado_em: string;
  existe_no_whatsapp: boolean;
}

interface SociosEmpresas {
  cnpj: string;
  nome: string;
  porte: string;
}
