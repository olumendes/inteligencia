import { Filtros } from "@/types/licitacao";

export const FILTROS_DISPONIVEIS: Filtros = {
  status: [
    { id: "aberta", label: "Aberta", count: 45 },
    { id: "encerrada", label: "Encerrada", count: 128 },
    { id: "resultado", label: "Com Resultado", count: 89 },
  ],
  modalidade: [
    { id: "leilao_eletronico", label: "Leilão Eletrônico", count: 23 },
    { id: "dialogo_competitivo", label: "Diálogo Competitivo", count: 12 },
    { id: "concurso", label: "Concurso", count: 8 },
    { id: "concorrencia_eletronica", label: "Concorrência - Eletrônica", count: 45 },
    { id: "concorrencia_presencial", label: "Concorrência - Presencial", count: 34 },
    { id: "pregao_eletronico", label: "Pregão - Eletrônico", count: 89 },
    { id: "pregao_presencial", label: "Pregão - Presencial", count: 56 },
    { id: "dispensa", label: "Dispensa", count: 78 },
    { id: "inexigibilidade", label: "Inexigibilidade", count: 45 },
    { id: "manifestacao_interesse", label: "Manifestação de Interesse", count: 12 },
    { id: "pre_qualificacao", label: "Pré-qualificação", count: 15 },
    { id: "credenciamento", label: "Credenciamento", count: 22 },
    { id: "leilao_presencial", label: "Leilão Presencial", count: 18 },
    { id: "inaplicabilidade", label: "Inaplicabilidade da Lei", count: 5 },
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

export const UF_FILTER = {
  sudeste: {
    label: "Sudeste",
    states: [
      { id: "es", label: "ES", name: "Espírito Santo" },
      { id: "mg", label: "MG", name: "Minas Gerais" },
      { id: "rj", label: "RJ", name: "Rio de Janeiro" },
      { id: "sp", label: "SP", name: "São Paulo" },
    ],
  },
  sul: {
    label: "Sul",
    states: [
      { id: "pr", label: "PR", name: "Paraná" },
      { id: "rs", label: "RS", name: "Rio Grande do Sul" },
      { id: "sc", label: "SC", name: "Santa Catarina" },
    ],
  },
  centro_oeste: {
    label: "Centro-Oeste",
    states: [
      { id: "df", label: "DF", name: "Distrito Federal" },
      { id: "go", label: "GO", name: "Goiás" },
      { id: "mt", label: "MT", name: "Mato Grosso" },
      { id: "ms", label: "MS", name: "Mato Grosso do Sul" },
    ],
  },
  nordeste: {
    label: "Nordeste",
    states: [
      { id: "al", label: "AL", name: "Alagoas" },
      { id: "ba", label: "BA", name: "Bahia" },
      { id: "ce", label: "CE", name: "Ceará" },
      { id: "ma", label: "MA", name: "Maranhão" },
      { id: "pb", label: "PB", name: "Paraíba" },
      { id: "pe", label: "PE", name: "Pernambuco" },
      { id: "pi", label: "PI", name: "Piauí" },
      { id: "rn", label: "RN", name: "Rio Grande do Norte" },
      { id: "se", label: "SE", name: "Sergipe" },
    ],
  },
  norte: {
    label: "Norte",
    states: [
      { id: "ac", label: "AC", name: "Acre" },
      { id: "ap", label: "AP", name: "Amapá" },
      { id: "am", label: "AM", name: "Amazonas" },
      { id: "pa", label: "PA", name: "Pará" },
      { id: "ro", label: "RO", name: "Rondônia" },
      { id: "rr", label: "RR", name: "Roraima" },
      { id: "to", label: "TO", name: "Tocantins" },
    ],
  },
};
