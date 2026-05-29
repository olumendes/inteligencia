import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, ToggleRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { mockAlertas } from "@/data/mockLicitacoes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Alertas() {
  const navigate = useNavigate();
  const { email } = useParams<{ email?: string }>();
  const [alertas, setAlertas] = useState(mockAlertas);
  const [novaPalavra, setNovaPalavra] = useState("");
  const [novaFrequencia, setNovaFrequencia] = useState<"diaria" | "semanal" | "mensal">("diaria");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddAlerta = () => {
    if (novaPalavra.trim()) {
      const newAlerta = {
        id: `a${Date.now()}`,
        palavra_chave: novaPalavra,
        ativo: true,
        frequencia: novaFrequencia,
        ultimaVerificacao: new Date().toLocaleDateString("pt-BR"),
      };
      setAlertas([...alertas, newAlerta]);
      setNovaPalavra("");
      setIsOpen(false);
    }
  };

  const toggleAlerta = (id: string) => {
    setAlertas(
      alertas.map((alerta) =>
        alerta.id === id ? { ...alerta, ativo: !alerta.ativo } : alerta
      )
    );
  };

  const deleteAlerta = (id: string) => {
    setAlertas(alertas.filter((alerta) => alerta.id !== id));
  };

  const getFrequenciaLabel = (freq: string) => {
    const labels: { [key: string]: string } = {
      diaria: "Diária",
      semanal: "Semanal",
      mensal: "Mensal",
    };
    return labels[freq] || freq;
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userEmail={email} />

      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-border">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Alertas de Palavras-chave
                </h1>
                <p className="text-foreground/60">
                  Receba notificações sobre novas licitações relacionadas aos seus termos de interesse
                </p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novo Alerta
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Alerta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Palavra-chave
                      </label>
                      <input
                        type="text"
                        value={novaPalavra}
                        onChange={(e) => setNovaPalavra(e.target.value)}
                        placeholder="Ex: TI, consultoria, segurança"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Frequência de Verificação
                      </label>
                      <select
                        value={novaFrequencia}
                        onChange={(e) => setNovaFrequencia(e.target.value as "diaria" | "semanal" | "mensal")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="diaria">Diária</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensal">Mensal</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddAlerta}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Criar Alerta
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-2 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-background transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 max-w-4xl">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-border rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">
                {alertas.length}
              </p>
              <p className="text-sm text-foreground/60">Total de Alertas</p>
            </div>
            <div className="bg-white border border-border rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-green-600 mb-1">
                {alertas.filter((a) => a.ativo).length}
              </p>
              <p className="text-sm text-foreground/60">Alertas Ativos</p>
            </div>
            <div className="bg-white border border-border rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-gray-600 mb-1">
                {alertas.filter((a) => !a.ativo).length}
              </p>
              <p className="text-sm text-foreground/60">Alertas Inativos</p>
            </div>
          </div>

          {/* Alertas List */}
          <div className="space-y-4">
            {alertas.length > 0 ? (
              alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-3">
                        {alerta.palavra_chave}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-foreground/60">Status</p>
                          <p className="font-semibold text-foreground">
                            {alerta.ativo ? (
                              <span className="text-green-600">Ativo</span>
                            ) : (
                              <span className="text-gray-600">Inativo</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-foreground/60">Frequência</p>
                          <p className="font-semibold text-foreground">
                            {getFrequenciaLabel(alerta.frequencia)}
                          </p>
                        </div>
                        <div>
                          <p className="text-foreground/60">Última Verificação</p>
                          <p className="font-semibold text-foreground">
                            {alerta.ultimaVerificacao}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 ml-6">
                      <button
                        onClick={() => toggleAlerta(alerta.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          alerta.ativo
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={alerta.ativo ? "Desativar" : "Ativar"}
                      >
                        <ToggleRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteAlerta(alerta.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white border border-border rounded-lg">
                <p className="text-foreground/60 mb-4">
                  Nenhum alerta configurado
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Alerta
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
