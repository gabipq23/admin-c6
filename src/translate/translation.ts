const translateEnum = {
  cor: "Cor",
  geekbluetooth: "geekbluetooth",
  cameraFrontal: "Câmera Frontal",
  cameraTraseira: "Câmera Traseira",
  gpsIntegrado: "GPS Integrado",
  hotspotWifi: "Hotspot Wifi",
  numeroDeSimCards: "Número de Sim Cards",
  peso: "Peso",
  processador: "Processador",
  reconhecimentoFacial: "Reconhecimento Facial",
  simCard: "Sim Card",
  sistemaOperacional: "Sistema Operacional",
  tamanho: "Tamanho",
  tecnologia: "Tecnologia",
  telaResolucao: "Tela Resolução",
  telaTecnologia: "Tela Tecnologia",
  tipoDeSimCard: "Tipo de Sim Card",
  wifi: "Wifi",
  marca: "Marca",
  partnumber: "Part Number",
  true: "Sim",
  false: "Não",
};

type TranslateKeys = keyof typeof translateEnum;
// Função para traduzir chaves de objeto e enums
function translate(key: keyof typeof translateEnum) {
  return translateEnum[key] ?? key;
}
export { translate, type TranslateKeys };
