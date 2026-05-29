import { useNavigate, useParams } from "react-router-dom";
import { Settings as SettingsIcon, Bell, Lock, User } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function Configuracoes() {
  const navigate = useNavigate();
  const { email } = useParams<{ email?: string }>();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userEmail={email} />

      <main className="flex-1">
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="px-6 py-8">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                Configurações
              </h1>
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <p className="text-foreground/60 mt-2">
              Personalize suas preferências e configurações
            </p>
          </div>
        </header>

        <div className="px-6 py-8 max-w-2xl">
          <div className="space-y-6">
            {/* Perfil */}
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Perfil</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    defaultValue="Oluam Mendes"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="oluanmendes@gmail.com"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">
                  Notificações
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-foreground">
                    Receber notificações de novos alertas
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-foreground">
                    Receber notificações de licitações salvas
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-foreground">
                    Receber newsletter semanal
                  </span>
                </label>
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-white border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Segurança</h3>
              </div>
              <button className="px-4 py-2 border-2 border-border text-foreground rounded-lg font-semibold hover:bg-background transition-colors">
                Alterar Senha
              </button>
            </div>

            {/* Salvar */}
            <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Salvar Alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
