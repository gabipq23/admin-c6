export interface OrderC6BankResponse {
  success: boolean;
  orders: OrderC6Bank[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  status_pos_venda_enum: string[];
}

export interface OrderC6Bank {
  id: number;
  company: string;
  order_number: number | null;
  status: string;
  order_type: string;
  order_token_active: boolean;
  after_sales_status?: string | null;

  full_name: string;
  cpf: string;
  email: string;
  phone: string;

  cnpj?: string | null;
  company_legal_name?: string | null;

  product_account_opening?: boolean | null;
  product_card_machine?: boolean | null;
  product_credit_card?: boolean | null;
  product_loan?: boolean | null;
  loan_amount?: number | null;

  app_click?: boolean | null;
  app_click_at?: string | null;
  app_register?: boolean | null;
  app_register_at?: string | null;

  responsible_consultant?: string | null;
  team?: string | null;
  consultant_notes?: string | null;
  consultant_observation?: string | null;

  business_partner: string;
  landing_page: string;
  client_ip: string;
  fingerprint_id?: string | null;

  created_at: string;
  updated_at: string;

  pf_temperature?: number | null;
  temperatura_pf?: number | null;
  rfb_name?: string | null;
  rfb_mother_name?: string | null;
  rfb_birth_date?: string | null;
  rfb_gender?: string | null;
  phone_valid?: boolean | null;
  operator?: string | null;
  portability: string | null;
  portability_date?: string | null;
  is_email_valid?: boolean | null;
  whatsapp?: {
    avatar: string;
    sucesso?: boolean | null;
    existe_no_whatsapp?: boolean | null;
  } | null;
  existe_no_whatsapp?: boolean | null;
  fingerprint?: {
    os: { name: string; version: string };
    browser: { name: string; version: string };
    device: string;
    timezone: string;
    timezone_name: string;
    timezone_offset: number;
    resolution?: { dpr: number; height: number; width: number };
  };
  corporate_id?: string | null;
  crm_id?: string | null;
  url: string;
  ip_access_type?: string | null;
  ip_isp?: string | null;

  single_zip_code?: boolean | null;
  zip_code?: string;
  state?: string | null;
  city?: string | null;
  district?: string | null;
  address?: string | null;
  address_number?: string | null;
  address_complement?: {
    lot?: string | null;
    block?: string | null;
    floor?: string | null;
    square?: string | null;
    unit_type?: string | null;
    unit_number?: string | null;
    building_or_house?: string | null;
    home_complement?: string | null;
    reference_point?: string | null;
  } | null;
  is_socio: boolean | null;
  is_mei: boolean | null;
  company_partners:
    | {
        nome: string;
        cnpj: string;
        porte: string;
      }[]
    | null;

  geolocation?: {
    latitude: number | null;
    longitude: number | null;
    maps_link?: string;
    street_view_link?: string;
  } | null;
}
export interface C6BankFilters {
  page?: string | number;
  per_page?: string | number;
  data_from?: string;
  data_to?: string;
  status?: string;
  cpf?: string;
  cnpj?: string;
  phone?: string;
  order_number?: string | number;
  sort?: string;
  order?: "asc" | "desc";
  after_sales_status?: string | null;
}
