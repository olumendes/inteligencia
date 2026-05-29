import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function Fornecedores() {
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Fornecedores
            </h1>
            <p className="text-foreground/60">
              Gerencie seus fornecedores e parceiros comerciais
            </p>
          </div>
        </header>

        <div className="px-6 py-8">
          <div className="bg-white border border-border rounded-lg p-12 text-center">
            <p className="text-foreground/60 mb-4">
              Esta seção está em desenvolvimento
            </p>
            <p className="text-sm text-foreground/40">
              Em breve você poderá gerenciar seus fornecedores
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
