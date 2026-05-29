import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut, Mail, User, Calendar, Star, CheckCircle, Settings } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Inteligência Licitatória
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-background rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Bem-vindo, {userInfo.name}!
          </h2>
          <p className="text-foreground/60">
            Gerencie suas licitações e preferências abaixo
          </p>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Email Card */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-foreground">E-mail</h3>
            </div>
            <p className="text-sm text-foreground/60">{userInfo.email}</p>
          </div>

          {/* Plan Card */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-foreground">Plano</h3>
            </div>
            <p className="text-sm font-medium text-primary capitalize">
              {userInfo.plan}
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="font-semibold text-foreground">Status</h3>
            </div>
            <p className="text-sm font-medium text-green-600 capitalize">
              {userInfo.status}
            </p>
          </div>

          {/* Member Since Card */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-foreground">Membro desde</h3>
            </div>
            <p className="text-sm text-foreground/60">{userInfo.createdAt}</p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Licitações Recentes */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Licitações Recentes
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: "Fornecimento de equipamentos de TI",
                  value: "R$ 50.000,00",
                  status: "Aberta",
                },
                {
                  title: "Serviços de consultoria administrativa",
                  value: "R$ 35.000,00",
                  status: "Encerrada",
                },
                {
                  title: "Manutenção de infraestrutura",
                  value: "R$ 75.000,00",
                  status: "Aberta",
                },
              ].map((bid, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-4 bg-background rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground mb-1">
                      {bid.title}
                    </p>
                    <p className="text-sm text-foreground/60">{bid.value}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bid.status === "Aberta"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Configurações Rápidas */}
          <div className="bg-white rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Nova Palavra-chave
              </button>
              <button className="w-full px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                Configurações
              </button>
              <button className="w-full px-4 py-2 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-background transition-colors">
                Filtros
              </button>
              <button className="w-full px-4 py-2 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-background transition-colors">
                Alertas
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { label: "Alertas Ativos", value: "12", color: "bg-blue-100 text-blue-700" },
            { label: "Licitações Salvas", value: "28", color: "bg-purple-100 text-purple-700" },
            { label: "Propostas Enviadas", value: "5", color: "bg-green-100 text-green-700" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-6 text-center ${stat.color}`}
            >
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm font-medium opacity-75">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
