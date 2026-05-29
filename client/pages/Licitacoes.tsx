import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Filter,
  Heart,
  ExternalLink,
  DollarSign,
  Calendar,
  Building2,
  ChevronDown,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Licitacao } from "@/types/licitacao";
import { mockLicitacoes } from "@/data/mockLicitacoes";
import { FILTROS_DISPONIVEIS, UF_FILTER } from "@/data/filtros";
import { cn } from "@/lib/utils";

export default function Licitacoes() {
  const navigate = useNavigate();
  const { email } = useParams<{ email?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({
    status: [],
    modalidade: [],
    uf: [],
    municipio: [],
    esfera: [],
    poder: [],
    tipo: [],
  });
  const [orgaoSearch, setOrgaoSearch] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"data" | "valor">("data");
  const [expandedUfRegion, setExpandedUfRegion] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 1024 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredLicitacoes = useMemo(() => {
    let result = mockLicitacoes;

    // Filtro de busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.titulo.toLowerCase().includes(search) ||
          l.descricao.toLowerCase().includes(search)
      );
    }

    // Filtro de salvas
    if (savedOnly) {
      result = result.filter((l) => l.salva);
    }

    // Filtros selecionados
    if (selectedFilters.status.length > 0) {
      result = result.filter((l) =>
        selectedFilters.status.includes(l.status)
      );
    }
    if (selectedFilters.modalidade.length > 0) {
      result = result.filter((l) =>
        selectedFilters.modalidade.includes(l.modalidade)
      );
    }
    if (selectedFilters.uf.length > 0) {
      result = result.filter((l) =>
        selectedFilters.uf.includes(l.uf || "")
      );
    }
    if (selectedFilters.municipio.length > 0) {
      result = result.filter((l) =>
        selectedFilters.municipio.includes(l.municipio || "")
      );
    }
    if (selectedFilters.esfera.length > 0) {
      result = result.filter((l) =>
        selectedFilters.esfera.includes(l.esfera || "")
      );
    }
    if (selectedFilters.poder.length > 0) {
      result = result.filter((l) =>
        selectedFilters.poder.includes(l.poder || "")
      );
    }
    if (selectedFilters.tipo.length > 0) {
      result = result.filter((l) =>
        selectedFilters.tipo.includes(l.tipo || "")
      );
    }
    if (orgaoSearch.trim()) {
      const search = orgaoSearch.toLowerCase();
      result = result.filter((l) =>
        l.orgao.toLowerCase().includes(search)
      );
    }

    // Ordenação
    if (sortBy === "valor") {
      result = [...result].sort((a, b) => b.valor - a.valor);
    } else {
      result = [...result].sort(
        (a, b) =>
          new Date(b.dataAbertura).getTime() -
          new Date(a.dataAbertura).getTime()
      );
    }

    return result;
  }, [searchTerm, selectedFilters, orgaoSearch, savedOnly, sortBy]);

  const toggleFilter = (category: string, filterId: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(filterId)
        ? prev[category].filter((id) => id !== filterId)
        : [...prev[category], filterId],
    }));
    if (window.innerWidth < 1024) {
      setFiltersOpen(false);
    }
  };

  const toggleSaved = (id: string) => {
    const index = mockLicitacoes.findIndex((l) => l.id === id);
    if (index !== -1) {
      mockLicitacoes[index].salva = !mockLicitacoes[index].salva;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return date;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userEmail={email} />

      <main className="flex-1 md:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-border sticky top-0 z-40">
          <div className="px-6 py-4">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Licitações
            </h1>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Buscar licitações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 relative z-10"
              >
                <Filter className="w-5 h-5" />
                Filtrar
              </button>
            </div>
          </div>
        </header>

        {/* Backdrop (Mobile Only) */}
        {filtersOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setFiltersOpen(false)}
            style={{ top: "120px" }}
          />
        )}

        <div className="flex h-[calc(100vh-120px)] relative">
          {/* Filters Sidebar */}
          <aside
            className="w-64 bg-white border-r border-border overflow-y-auto z-30"
            style={{
              position: isMobile ? "fixed" : "relative",
              top: isMobile ? "120px" : "auto",
              left: 0,
              height: isMobile ? "100vh" : "auto",
              display: isMobile && !filtersOpen ? "none" : "block"
            }}
          >
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setFiltersOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-background rounded-lg transition-colors z-40"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>

              <div className="mt-8 lg:mt-0">
                {/* Quick Filters */}
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-3">
                    Filtros Rápidos
                  </h3>
                  <button
                    onClick={() => setSavedOnly(!savedOnly)}
                    className={cn(
                      "w-full px-4 py-2 rounded-lg font-medium transition-colors text-left flex items-center gap-2",
                      savedOnly
                        ? "bg-red-100 text-red-700"
                        : "bg-background text-foreground/70 hover:bg-background"
                    )}
                  >
                    <Heart className="w-4 h-4" />
                    Apenas Salvas
                  </button>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Status
                  </h4>
                  <div className="space-y-2">
                    {FILTROS_DISPONIVEIS.status.map((filter) => (
                      <label key={filter.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.status.includes(filter.id)}
                          onChange={() => toggleFilter("status", filter.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground/70">
                          {filter.label}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          ({filter.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Modalidade Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Modalidade
                  </h4>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {FILTROS_DISPONIVEIS.modalidade.map((filter) => (
                      <label key={filter.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.modalidade.includes(filter.id)}
                          onChange={() =>
                            toggleFilter("modalidade", filter.id)
                          }
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground/70">
                          {filter.label}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          ({filter.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Razão Social do Órgão Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Razão Social do Órgão
                  </h4>
                  <input
                    type="text"
                    placeholder="Digite o nome do órgão..."
                    value={orgaoSearch}
                    onChange={(e) => setOrgaoSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Esfera Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Esfera
                  </h4>
                  <div className="space-y-2">
                    {FILTROS_DISPONIVEIS.esfera?.map((filter) => (
                      <label key={filter.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.esfera.includes(filter.id)}
                          onChange={() => toggleFilter("esfera", filter.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground/70">
                          {filter.label}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          ({filter.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Poder Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Poder
                  </h4>
                  <div className="space-y-2">
                    {FILTROS_DISPONIVEIS.poder?.map((filter) => (
                      <label key={filter.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.poder.includes(filter.id)}
                          onChange={() => toggleFilter("poder", filter.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground/70">
                          {filter.label}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          ({filter.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tipo Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Tipo
                  </h4>
                  <div className="space-y-2">
                    {FILTROS_DISPONIVEIS.tipo?.map((filter) => (
                      <label key={filter.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.tipo.includes(filter.id)}
                          onChange={() => toggleFilter("tipo", filter.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground/70">
                          {filter.label}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          ({filter.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Municípios Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Municípios
                  </h4>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {FILTROS_DISPONIVEIS.municipio?.map((filter) => (
                      <label key={filter.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.municipio.includes(filter.id)}
                          onChange={() => toggleFilter("municipio", filter.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground/70">
                          {filter.label}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          ({filter.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* UF Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    UF
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(UF_FILTER).map(([regionKey, region]) => (
                      <div key={regionKey}>
                        <button
                          onClick={() =>
                            setExpandedUfRegion(
                              expandedUfRegion === regionKey ? null : regionKey
                            )
                          }
                          className="w-full text-left px-3 py-2 hover:bg-background rounded-lg transition-colors flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-foreground">
                            {region.label} (0/{region.states.length})
                          </span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              expandedUfRegion === regionKey && "rotate-180"
                            )}
                          />
                        </button>
                        {expandedUfRegion === regionKey && (
                          <div className="ml-4 mt-2 space-y-2">
                            {region.states.map((state) => (
                              <label
                                key={state.id}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.uf.includes(state.id)}
                                  onChange={() =>
                                    toggleFilter("uf", state.id)
                                  }
                                  className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm text-foreground/70">
                                  {state.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {Object.values(selectedFilters).some((arr) => arr.length > 0) ||
                orgaoSearch.trim() ||
                savedOnly ? (
                  <button
                  onClick={() => {
                    setSelectedFilters({
                      status: [],
                      modalidade: [],
                      uf: [],
                      municipio: [],
                      esfera: [],
                      poder: [],
                      tipo: [],
                    });
                    setOrgaoSearch("");
                    setSavedOnly(false);
                  }}
                  className="w-full px-4 py-2 border-2 border-border text-foreground rounded-lg font-medium hover:bg-background transition-colors"
                  >
                    Limpar Filtros
                  </button>
                ) : null}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Sort Options */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-foreground/60">
                {filteredLicitacoes.length} licitações encontradas
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "data" | "valor")}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-white"
              >
                <option value="data">Mais Recentes</option>
                <option value="valor">Maior Valor</option>
              </select>
            </div>

            {/* Licitações List */}
            {filteredLicitacoes.length > 0 ? (
              <div className="space-y-4">
                {filteredLicitacoes.map((licitacao) => (
                  <div
                    key={licitacao.id}
                    className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          {licitacao.titulo}
                        </h3>
                        <p className="text-sm text-foreground/60 mb-4">
                          {licitacao.descricao}
                        </p>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-foreground/70">
                            <DollarSign className="w-4 h-4" />
                            {formatCurrency(licitacao.valor)}
                          </div>
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Building2 className="w-4 h-4" />
                            {licitacao.orgao}
                          </div>
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Filter className="w-4 h-4" />
                            {licitacao.modalidade}
                          </div>
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Calendar className="w-4 h-4" />
                            {formatDate(licitacao.dataEncerramento)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 ml-4">
                        <button
                          onClick={() => toggleSaved(licitacao.id)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            licitacao.salva
                              ? "bg-red-100 text-red-600"
                              : "bg-background text-foreground/40 hover:text-red-600"
                          )}
                        >
                          <Heart
                            className="w-5 h-5"
                            fill={licitacao.salva ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          licitacao.status === "aberta"
                            ? "bg-green-100 text-green-700"
                            : licitacao.status === "resultado"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {licitacao.status === "aberta"
                          ? "Aberta"
                          : licitacao.status === "encerrada"
                            ? "Encerrada"
                            : "Com Resultado"}
                      </span>
                      {licitacao.link && (
                        <a
                          href={licitacao.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                        >
                          Ver Detalhes
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">
                  Nenhuma licitação encontrada com os filtros selecionados.
                </p>
                <button
                  onClick={() => {
                    setSelectedFilters({
                      status: [],
                      modalidade: [],
                      uf: [],
                      municipio: [],
                      esfera: [],
                      poder: [],
                      tipo: [],
                    });
                    setSavedOnly(false);
                    setSearchTerm("");
                    setOrgaoSearch("");
                  }}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
