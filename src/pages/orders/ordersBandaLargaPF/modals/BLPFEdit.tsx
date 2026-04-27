import {
  Button,
  Form,
  Select,

} from "antd";
import { FormInstance } from "antd/es/form";
import InputGenerator from "@/components/inputGenerator";
import { outlineButtonClass } from "@/utils/buttonStyles";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { OrderC6Bank } from "@/interfaces/orders";

interface OrderBandaLargaPFEditProps {
  localData: OrderC6Bank;
  form: FormInstance;
  handleSave: () => void;
  handleCancel: () => void;
  loading: boolean;
}

export function OrderEdit({
  localData,
  form,
  handleSave,
  handleCancel,
  loading,
}: OrderBandaLargaPFEditProps) {

  const selectedPropertyType =
    Form.useWatch(["address_complement", "building_or_house"], form) ||
    localData.address_complement?.building_or_house ||
    "house";


  return (
    <Form
      form={form}
      layout="vertical"
      className="flex flex-col h-full gap-4"
      onFinish={handleSave}
    >
      <div className="flex flex-col  w-full gap-2">


        {/* Informações do Cliente */}
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
          <div className="flex items-center mb-1">
            <h2 className="text-[14px] text-[#666666]">
              Informações do Cliente
            </h2>
          </div>
          <div className="flex flex-col text-neutral-800  rounded-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 1 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Nome Completo:"
                  formItemName="full_name"
                  formItemValue={localData.full_name || ""}
                  placeholder="Nome completo"
                />


                <InputGenerator
                  title="Email:"
                  formItemName="email"
                  formItemValue={localData.email || ""}
                  placeholder="Email"
                />
              </div>

              {/* Coluna 2 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="CPF:"
                  formItemName="cpf"
                  formItemValue={localData.cpf || ""}
                  placeholder="CPF"
                />

                <InputGenerator
                  title="Telefone:"
                  formItemName="phone"
                  formItemValue={
                    formatPhoneNumber(localData?.phone) || ""
                  }
                  placeholder="Telefone"
                />

                {/* <InputGenerator
                  title="Telefone Adicional:"
                  formItemName="additional_phone"
                  formItemValue={
                    localData?.additional_phone
                      ? formatPhoneNumber(localData.additional_phone)
                      : ""
                  }
                  placeholder="Telefone"
                /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Endereço */}
        <div className="flex flex-col bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
          <div className="flex items-center mb-1">
            <h2 className="text-[14px] text-[#666666]">
              Informações de Endereço
            </h2>
          </div>

          <div className="flex flex-col text-neutral-800  rounded-lg p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coluna 1 */}
              <div className="flex flex-col gap-1">
                <InputGenerator
                  title="Endereço:"
                  formItemName="address"
                  formItemValue={localData.address || ""}
                  placeholder="Endereço"
                />
                <InputGenerator
                  title="Número:"
                  formItemName="address_number"
                  formItemValue={localData.address_number || ""}
                  placeholder="Número"
                />

                {selectedPropertyType === "house" ? (
                  <InputGenerator
                    title="Complemento:"
                    formItemName={["address_complement", "home_complement"]}
                    formItemValue={localData.address_complement?.home_complement || ""}
                    placeholder="Complemento"
                  />
                ) : (
                  <>
                    <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
                      <div className="flex ">
                        <p>
                          <strong>Tipo da unidade:</strong>
                        </p>
                      </div>
                      <div className="flex flex-1">
                        <Form.Item
                          name={["address_complement", "unit_type"]}
                          className="mb-0 "
                        >
                          <Select
                            placeholder="Tipo da unidade"
                            className="min-w-[150px]"
                            size="small"
                          >
                            <Select.Option value="apto">Apartamento</Select.Option>
                            <Select.Option value="sala">Sala</Select.Option>
                            <Select.Option value="conjunto">Conjunto</Select.Option>
                            <Select.Option value="loja">Loja</Select.Option>
                            <Select.Option value="outros">Outros</Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                    <InputGenerator
                      title="Número da unidade:"
                      formItemName={["address_complement", "unit_number"]}
                      formItemValue={localData.address_complement?.unit_number || ""}
                      placeholder="Ex: 1203"
                    />
                  </>
                )}

                <InputGenerator
                  title="Andar:"
                  formItemName={["address_complement", "floor"]}
                  formItemValue={localData.address_complement?.floor || ""}
                  placeholder="Andar"
                />
                <InputGenerator
                  title="Lote:"
                  formItemName={["address_complement", "lot"]}
                  formItemValue={localData.address_complement?.lot || ""}
                  placeholder="Lote"
                />

                <InputGenerator
                  title="Quadra:"
                  formItemName={["address_complement", "square"]}
                  formItemValue={localData.address_complement?.square || ""}
                  placeholder="Quadra"
                />

                <InputGenerator
                  title="Ponto de Referência"
                  formItemName={["address_complement", "reference_point"]}
                  formItemValue={localData.address_complement?.reference_point || ""}
                  placeholder="Ponto de Referência"
                />
              </div>

              {/* Coluna 2 */}
              <div className="flex flex-col gap-1">
                <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
                  <div className="flex ">
                    <p>
                      <strong>Tipo:</strong>
                    </p>
                  </div>
                  <div className="flex flex-1">
                    <Form.Item name={["address_complement", "building_or_house"]} className="mb-0 ">
                      <Select
                        placeholder="Tipo de imóvel"
                        className="min-w-[150px]"
                        size="small"
                      >
                        <Select.Option value={"building"}>
                          Edifício
                        </Select.Option>
                        <Select.Option value={"house"}>Casa</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <InputGenerator
                  title="Bairro:"
                  formItemName="district"
                  formItemValue={localData.district || ""}
                  placeholder="Bairro"
                />

                <InputGenerator
                  title="Cidade:"
                  formItemName="city"
                  formItemValue={localData.city || ""}
                  placeholder="Cidade"
                />

                <InputGenerator
                  title="UF:"
                  formItemName="state"
                  formItemValue={localData.state || ""}
                  placeholder="UF"
                />

                <InputGenerator
                  title="CEP:"
                  formItemName="zip_code"
                  formItemValue={localData.zip_code
                    || ""}
                  placeholder="CEP"
                />
                <div className="flex h-9 gap-4 text-[14px] w-full text-neutral-700">
                  <div className="flex ">
                    <p>
                      <strong>CEP único:</strong>
                    </p>
                  </div>
                  <div className="flex flex-1">
                    <Form.Item name="single_zip_code" className="mb-0 ">
                      <Select
                        placeholder="CEP único"
                        className="min-w-[150px]"
                        size="small"
                      >
                        <Select.Option value={1}>Sim</Select.Option>
                        <Select.Option value={0}>Não</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex justify-end gap-4 z-10"
        style={{
          position: "sticky",
          bottom: -1,
          left: 0,
          right: 0,
          paddingTop: "8px",
          paddingBottom: "8px",
          background: "#ffffff",
        }}
      >
        <Button
          onClick={handleCancel}
          className={outlineButtonClass}
          style={{
            fontSize: "14px",
          }}
        >
          Cancelar
        </Button>
        <Button
          htmlType="submit"
          loading={loading}
          className={outlineButtonClass}
          style={{
            fontSize: "14px",
          }}
        >
          Salvar
        </Button>
      </div>
    </Form>
  );
}
