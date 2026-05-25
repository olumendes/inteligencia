import { useState } from "react";
import { Mail, Phone, X } from "lucide-react";
import { apiClient, API_ENDPOINTS } from "@/config/api";

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await apiClient.post(API_ENDPOINTS.TRIAL_SIGNUP, formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "" });
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-background rounded-lg transition-colors"
          aria-label="Fechar modal"
        >
          <X size={20} className="text-foreground/60" />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Teste grátis por 14 dias
        </h2>
        <p className="text-foreground/70 mb-6 text-sm">
          Sem cartão de crédito, sem compromisso. Acesso completo a todos os recursos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Seu nome completo"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Phone size={14} /> Telefone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="(11) 98765-4321"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Mensagens de status */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              ✓ Teste ativado com sucesso! Verifique seu e-mail.
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              ✗ {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Ativando..." : "Ativar teste grátis"}
          </button>

          <p className="text-xs text-foreground/60 text-center mt-4">
            Ao continuar, você concorda com nossos <a href="#" className="text-primary hover:underline">Termos de Uso</a>
          </p>
        </form>
      </div>
    </div>
  );
}
