export interface Licitacao {
  id: string;
  titulo: string;
  valor: number;
  status: "aberta" | "encerrada" | "resultado";
  modalidade: string;
  orgao: string;
  uf?: string;
  dataAbertura: string;
  dataEncerramento: string;
  descricao: string;
  salva: boolean;
  link?: string;
}

export interface Alerta {
  id: string;
  palavra_chave: string;
  ativo: boolean;
  frequencia: "diaria" | "semanal" | "mensal";
  ultimaVerificacao: string;
}

export interface Proposta {
  id: string;
  licitacaoId: string;
  titulo: string;
  dataEnvio: string;
  status: "enviada" | "avaliando" | "aprovada" | "rejeitada";
  valor: number;
}

export interface Filtro {
  id: string;
  label: string;
  count: number;
}

export interface Filtros {
  status: Filtro[];
  modalidade: Filtro[];
  orgao: Filtro[];
  valor: Filtro[];
}
