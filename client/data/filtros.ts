import { Filtros } from "@/types/licitacao";

export const FILTROS_DISPONIVEIS: Filtros = {
  status: [
    { id: "aberta", label: "Aberta", count: 45 },
    { id: "encerrada", label: "Encerrada", count: 128 },
    { id: "resultado", label: "Com Resultado", count: 89 },
  ],
  modalidade: [
    { id: "pregao", label: "Pregão", count: 67 },
    { id: "concorrencia", label: "Concorrência", count: 145 },
    { id: "rdc", label: "RDC", count: 50 },
  ],
  orgao: [
    { id: "prefeitura", label: "Prefeitura Municipal", count: 34 },
    { id: "governo_estadual", label: "Governo Estadual", count: 89 },
    { id: "governo_federal", label: "Governo Federal", count: 139 },
  ],
  valor: [
    { id: "ate_5k", label: "Até R$ 5.000", count: 12 },
    { id: "5k_50k", label: "R$ 5.000 - R$ 50.000", count: 89 },
    { id: "50k_500k", label: "R$ 50.000 - R$ 500.000", count: 134 },
    { id: "acima_500k", label: "Acima de R$ 500.000", count: 27 },
  ],
};
