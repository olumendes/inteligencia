import { useNavigate, useParams } from "react-router-dom";
import { Crown } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function Calendario() {
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
              <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
              <Crown className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-foreground/60 mt-2">
              Recurso premium - Visualize datas de licitações em calendário
            </p>
          </div>
        </header>

        <div className="px-6 py-8">
          <div className="bg-white border border-border rounded-lg p-12 text-center">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-foreground/60 mb-4">
              Este é um recurso premium
            </p>
            <button
              onClick={() => navigate("/assinar")}
              className="text-primary hover:text-primary/80 font-semibold"
            >
              Upgrade para Premium
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
