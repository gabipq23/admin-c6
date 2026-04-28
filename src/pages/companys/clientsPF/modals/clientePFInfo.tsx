
import { capitalizeWords } from "@/utils/capitaliWords";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { outlineButtonClass } from "@/utils/buttonStyles";
import { Button, Modal, Tooltip } from "antd";
import { ICompany } from "@/interfaces/consult";
import { formatCPF } from "@/utils/formatCPF";
import {
  CheckCircle2,
  XCircle,
  Mars,
  Venus,
  MapIcon,
  MapPinned,
} from "lucide-react";
const normalizeText = (t: string) =>
  t.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const compareStrings = (
  a?: string | null,
  b?: string | null,
): boolean | null => {
  if (!a || !b) return null;
  return normalizeText(a) === normalizeText(b);
};

function RfbBadge({
  match,
  trueTitle,
  falseTitle,
}: {
  match: boolean | null;
  trueTitle: string;
  falseTitle: string;
}) {
  if (match === true)
    return (
      <Tooltip title={trueTitle} placement="top" styles={{ body: { fontSize: "12px" } }}>
        <CheckCircle2 className="inline h-4 w-4 text-green-500 ml-1" />
      </Tooltip>
    );
  if (match === false)
    return (
      <Tooltip title={falseTitle} placement="top" styles={{ body: { fontSize: "12px" } }}>
        <XCircle className="inline h-4 w-4 text-red-500 ml-1" />
      </Tooltip>
    );
  return null;
}

export function ClientPFInfoModal({
  isModalOpen,
  closeModal,
  selectedClient,
}: {
  isModalOpen: boolean;
  selectedClient: ICompany | null;
  closeModal: () => void;
}) {
  const c = selectedClient;

  const nameMatch = compareStrings(c?.full_name, c?.rfb_name);
  const motherMatch = compareStrings(c?.mother_full_name, c?.rfb_mother_name);
  const birthMatch = (() => {
    const d1 = c?.birth_date;
    const d2 = c?.rfb_birth_date;
    if (!d1 || !d2 || d1 === "00/00/0000") return null;
    return d1.trim() === d2.trim();
  })();


  const wpp = c?.whatsapp as unknown as {
    sucesso?: boolean;
    existe_no_whatsapp?: boolean;
    is_comercial?: boolean;
    erro?: string;
  } | null;

  const whatsappLabel = (() => {
    if (!wpp) return "-";
    if (wpp.erro === "Telefone inválido" || wpp.sucesso === false) return "Não";
    if (wpp.existe_no_whatsapp === false) return "Não";
    if (wpp.is_comercial === true) return "Business";
    if (wpp.is_comercial === false) return "Messenger";
    return "-";
  })();

  const partners = c?.company_partners as unknown as
    | { cnpj: string; nome: string; porte: string }[]
    | null;


  const geo = c?.geolocation;

  return (
    <Modal
      centered
      title={
        <div className="flex justify-between">
          <span style={{ color: "#252525" }}>
            {capitalizeWords(c?.full_name || c?.cpf || "")}
          </span>
        </div>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      width={1000}
    >
      <div className="flex items-start justify-center gap-2 max-h-[500px] overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-3 text-[14px] py-3 w-full">

          {/* ── Identificação ── */}
          <div className="flex flex-col gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
            <h2 className="text-[14px] font-semibold">Identificação</h2>
            <div className="flex flex-col text-neutral-800 gap-2 rounded-lg p-4">

              {/* Nome + RFB */}
              <div className="text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Nome:</strong>{" "}
                  <span className="inline-flex items-center gap-1">
                    {capitalizeWords(c?.full_name || "") || "-"}
                    <RfbBadge
                      match={nameMatch}
                      trueTitle="Nome confere com RFB"
                      falseTitle="Nome diferente da RFB"
                    />
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>CPF:</strong> {formatCPF(c?.cpf || "") || "-"}
                </p>
                {/* Gênero */}
                <p className="flex items-center gap-1">
                  <strong>Gênero:</strong>{" "}
                  {c?.rfb_gender === "M" ? (
                    <Mars size={16} color="blue" />
                  ) : c?.rfb_gender === "F" ? (
                    <Venus size={16} color="magenta" />
                  ) : (
                    "-"
                  )}
                </p>
              </div>

              {/* Data de Nascimento + RFB */}
              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Nascimento:</strong>{" "}
                  <span className="inline-flex items-center gap-1">
                    {c?.birth_date && c.birth_date !== "00/00/0000"
                      ? c.birth_date
                      : "-"}
                    <RfbBadge
                      match={birthMatch}
                      trueTitle="Data de nascimento confere com RFB"
                      falseTitle="Data de nascimento diferente da RFB"
                    />
                  </span>
                </p>
                <p>
                  <strong>MEI:</strong>{" "}
                  {c?.is_mei === true
                    ? "Sim"
                    : c?.is_mei === false
                      ? "Não"
                      : "-"}
                </p>
              </div>

              {/* Nome da Mãe + RFB */}
              <div className="text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Nome da Mãe:</strong>{" "}
                  <span className="inline-flex items-center gap-1">
                    {c?.mother_full_name || "-"}
                    <RfbBadge
                      match={motherMatch}
                      trueTitle="Nome da mãe confere com RFB"
                      falseTitle="Nome da mãe diferente da RFB"
                    />
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Sócio:</strong>{" "}
                  {c?.is_socio === true
                    ? "Sim"
                    : c?.is_socio === false
                      ? "Não"
                      : "-"}
                </p>
              </div>

              {/* Empresas parceiras */}
              {Array.isArray(partners) && partners.length > 0 && (
                <div className="text-[14px] w-full text-neutral-700">
                  <p className="font-semibold mb-1">Empresas:</p>
                  <div className="flex flex-col gap-1 pl-2">
                    {partners.map((emp, i) => (
                      <p key={i}>
                        {emp.cnpj} — {emp.nome} ({emp.porte})
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Contato ── */}
          <div className="flex flex-col gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
            <h2 className="text-[14px] font-semibold">Contato</h2>
            <div className="flex flex-col text-neutral-800 gap-2 rounded-lg p-4">

              {/* Telefone principal */}
              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p className="flex items-center gap-1">
                  <strong>Telefone:</strong>{" "}
                  {c?.phone ? formatPhoneNumber(c.phone) : "-"}


                </p>

              </div>

              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Portado:</strong> {c?.portability || "-"}
                </p>

              </div>

              {/* Whatsapp */}
              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>WhatsApp:</strong>{" "}
                  {whatsappLabel === "Business" ? (
                    <span className="inline-flex items-center gap-1">
                      Business{" "}
                      <img
                        src="/assets/whatsapp-business.png"
                        alt="Business"
                        className="h-4 w-4"
                      />
                    </span>
                  ) : whatsappLabel === "Messenger" ? (
                    <span className="inline-flex items-center gap-1">
                      Messenger{" "}
                      <img
                        src="/assets/whatsapp-messenger.png"
                        alt="Messenger"
                        className="h-4 w-4"
                      />
                    </span>
                  ) : (
                    whatsappLabel
                  )}
                </p>

                {/* Telefone adicional */}
                <p className="flex items-center gap-1">
                  <strong>Tel. Adicional:</strong>{" "}
                  {c?.additional_phone
                    || "-"}
                </p>
              </div>

              {/* Email */}
              <div className="text-[14px] w-full text-neutral-700">
                <p className="flex items-center gap-1">
                  <strong>Eail:</strong>{" "}

                  {c?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Endereço ── */}
          <div className="flex flex-col gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
            <h2 className="text-[14px] font-semibold">Endereço</h2>
            <div className="flex flex-col text-neutral-800 gap-2 rounded-lg p-4">

              <div className="text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Endereço:</strong>{" "}
                  {capitalizeWords(c?.address || "") || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Número:</strong> {c?.address_number || "-"}
                </p>
                <p>
                  <strong>Complemento:</strong>{" "}
                  {capitalizeWords(c?.address_complement || "") || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Bairro:</strong>{" "}
                  {capitalizeWords(c?.district || "") || "-"}
                </p>
                <p>
                  <strong>CEP:</strong> {c?.zip_code || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Cidade:</strong>{" "}
                  {capitalizeWords(c?.city || "") || "-"}
                </p>
                <p>
                  <strong>UF:</strong> {c?.state || "-"}
                </p>
              </div>

              {/* Geolocalização */}
              {geo && (geo.latitude || geo.maps_link) && (
                <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                  <p>
                    <strong>Coordenadas:</strong>{" "}
                    {geo.latitude && geo.longitude
                      ? `${geo.latitude}, ${geo.longitude}`
                      : "-"}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Maps:</strong>{" "}
                    {geo.maps_link ? (
                      <Button
                        size="small"
                        style={{ width: 28, height: 28, padding: 0 }}
                        onClick={() => window.open(geo.maps_link!, "_blank")}
                      >
                        <MapIcon size={14} />
                      </Button>
                    ) : (
                      "-"
                    )}
                    <strong>Street View:</strong>{" "}
                    {geo.street_view_link ? (
                      <Button
                        size="small"
                        style={{ width: 28, height: 28, padding: 0 }}
                        onClick={() => window.open(geo.street_view_link!, "_blank")}
                      >
                        <MapPinned size={14} />
                      </Button>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Crédito ── */}
          <div className="flex flex-col gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3 w-full">
            <h2 className="text-[14px] font-semibold">Dados de Crédito</h2>
            <div className="flex flex-col text-neutral-800 gap-2 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Crédito:</strong>{" "}
                  R${" "}
                  {(c?.credit ?? 0).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="mt-4 flex gap-4 justify-end mr-4">
        <Button
          onClick={closeModal}
          className={outlineButtonClass}
          style={{ fontSize: "14px" }}
        >
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
