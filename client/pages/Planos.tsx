import { useNavigate, useParams } from "react-router-dom";
import { Crown, Check } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function Planos() {
  const navigate = useNavigate();
  const { email } = useParams<{ email?: string }>();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const plans = [
    {
      name: "Básico",
      price: "Grátis",
      features: ["10 alertas", "Busca básica", "Suporte por email"],
    },
    {
      name: "Pro",
      price: "R$ 99/mês",
      features: [
        "100 alertas",
        "Busca avançada",
        "Listas personalizadas",
        "Calendário",
        "Suporte prioritário",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Sob consulta",
      features: [
        "Alertas ilimitados",
        "API de integração",
        "Análise de dados",
        "Suporte dedicado",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userEmail={email} />

      <main className="flex-1">
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Nossos Planos
            </h1>
            <p className="text-foreground/60">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>
        </header>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-8 ${
                  plan.popular
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="mb-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-primary mb-6">
                  {plan.price}
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-2 border-border text-foreground hover:bg-background"
                  }`}
                >
                  Assinar Agora
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
