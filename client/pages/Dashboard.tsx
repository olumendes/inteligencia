import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Calendar, Star, CheckCircle, Plus, Bell, Heart, ArrowRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { mockLicitacoes, mockAlertas, mockPropostas } from "@/data/mockLicitacoes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  plan: string;
  status: string;
}

const USER_DATA: UserInfo = {
  id: "user-001",
  email: "oluanmendes@gmail.com",
  name: "Oluam Mendes",
  createdAt: "15/01/2024",
  plan: "premium",
  status: "active",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newFrequencia, setNewFrequencia] = useState<"diaria" | "semanal" | "mensal">("diaria");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (email === USER_DATA.email) {
      setUserInfo(USER_DATA);
      setLoading(false);
    } else {
      setError("Usuário não encontrado");
      setLoading(false);
    }
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const newAlerta = {
        id: `a${Date.now()}`,
        palavra_chave: newKeyword,
        ativo: true,
        frequencia: newFrequencia,
        ultimaVerificacao: new Date().toLocaleDateString("pt-BR"),
      };
      mockAlertas.push(newAlerta);
      setNewKeyword("");
      setIsOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Usuário não encontrado"}</p>
          <button
            onClick={() => navigate("/login")}
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Voltar para login
          </button>
        </div>
      </div>
    );
  }

  const alertasAtivos = mockAlertas.filter((a) => a.ativo).length;
  const licicitacoesSalvas = mockLicitacoes.filter((l) => l.salva).length;
  const propostasEnviadas = mockPropostas.length;
  const licicitacoesRecentes = mockLicitacoes.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userEmail={email} />

      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo, {userInfo.name}!
            </h1>
            <p className="text-foreground/60">
              Gerencie suas licitações e preferências abaixo
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-8">
          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">E-mail</h3>
              </div>
              <p className="text-sm text-foreground/60">{userInfo.email}</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">Plano</h3>
              </div>
              <p className="text-sm font-medium text-primary capitalize">
                {userInfo.plan}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h3 className="font-semibold text-foreground">Status</h3>
              </div>
              <p className="text-sm font-medium text-green-600 capitalize">
                {userInfo.status}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-foreground">Membro desde</h3>
              </div>
              <p className="text-sm text-foreground/60">{userInfo.createdAt}</p>
            </div>
          </div>

          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Licitações Recentes */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">
                  Licitações Recentes
                </h3>
                <button
                  onClick={() => navigate("/licitacoes")}
                  className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1"
                >
                  Ver Todas
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {licicitacoesRecentes.map((licitacao) => (
                  <div
                    key={licitacao.id}
                    className="flex items-start justify-between p-4 bg-background rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-1">
                        {licitacao.titulo}
                      </p>
                      <p className="text-sm text-foreground/60">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(licitacao.valor)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        licitacao.status === "aberta"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {licitacao.status === "aberta"
                        ? "Aberta"
                        : licitacao.status === "encerrada"
                          ? "Encerrada"
                          : "Com Resultado"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" />
                      Nova Palavra-chave
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
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Ex: TI, consultoria, segurança"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Frequência de Verificação
                        </label>
                        <select
                          value={newFrequencia}
                          onChange={(e) =>
                            setNewFrequencia(
                              e.target.value as "diaria" | "semanal" | "mensal"
                            )
                          }
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="diaria">Diária</option>
                          <option value="semanal">Semanal</option>
                          <option value="mensal">Mensal</option>
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleAddKeyword}
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
                <button
                  onClick={() => navigate("/licitacoes")}
                  className="w-full px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  Filtros
                </button>
                <button
                  onClick={() => navigate("/alertas")}
                  className="w-full px-4 py-2 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-background transition-colors flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Alertas
                </button>
                <button
                  onClick={() => navigate("/configuracoes")}
                  className="w-full px-4 py-2 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-background transition-colors"
                >
                  Configurações
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg p-6 bg-blue-100 text-blue-700">
              <p className="text-3xl font-bold mb-1">{alertasAtivos}</p>
              <p className="text-sm font-medium opacity-75">Alertas Ativos</p>
            </div>
            <div className="rounded-lg p-6 bg-purple-100 text-purple-700">
              <p className="text-3xl font-bold mb-1">{licicitacoesSalvas}</p>
              <p className="text-sm font-medium opacity-75">
                Licitações Salvas
              </p>
            </div>
            <div className="rounded-lg p-6 bg-green-100 text-green-700">
              <p className="text-3xl font-bold mb-1">{propostasEnviadas}</p>
              <p className="text-sm font-medium opacity-75">Propostas Enviadas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
