import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import TrialModal from "@/components/TrialModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Check, AlertCircle, Clock, Settings, Download, BarChart3 } from "lucide-react";

export default function Index() {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenTrial={() => setIsTrialModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Encontre licitações automáticamente
              </h1>
              <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
                Pare de garimpar manualmente. Receba automaticamente as licitações
                públicas que combinam com o que sua empresa vende, com alertas por
                e-mail e processamento inteligente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg"
                >
                  Começar teste grátis por 14 dias
                </button>
                <button className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                  Fazer Login
                </button>
              </div>
              <p className="text-sm text-foreground/60">
                Teste todos os recursos. <span className="font-semibold">Sem cobrança automática</span>.
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-border w-full">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-3 mt-6">
                    <div className="h-4 bg-border rounded w-3/4"></div>
                    <div className="h-4 bg-border rounded w-full"></div>
                    <div className="h-4 bg-border rounded w-5/6"></div>
                    <div className="h-2 bg-border rounded w-1/2"></div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="bg-primary/10 p-3 rounded border border-primary/20">
                      <div className="h-3 bg-primary/30 rounded w-1/3 mb-2"></div>
                      <div className="h-2 bg-primary/20 rounded w-full"></div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded border border-primary/20">
                      <div className="h-3 bg-primary/30 rounded w-2/5 mb-2"></div>
                      <div className="h-2 bg-primary/20 rounded w-full"></div>
                    </div>
                  </div>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded mt-6 font-semibold text-sm">
                    Pesquisar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl">⭐</span>
              ))}
            </div>
            <p className="text-center sm:text-left text-foreground/70">
              <strong className="text-foreground">95% recomendariam</strong> a
              Inteligência Licitatória (1.200+ usuários ativos)
            </p>
          </div>
        </div>
      </section>

      <ContactForm />

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
            O que o Inteligência Licitatória resolve para você
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertCircle,
                title: "Menos ruído, mais foco",
                description:
                  "A IA interpreta o que você vende e ajuda a priorizar licitações com mais chance de fazer sentido.",
              },
              {
                icon: Clock,
                title: "Alertas no momento certo",
                description:
                  "Receba oportunidades por e-mail no horário escolhido. Nunca mais perca um edital importante.",
              },
              {
                icon: BarChart3,
                title: "Pipeline de oportunidades",
                description:
                  "Filtre por região, modalidade e valor. Salve favoritas, anote e visualize no mapa.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="border border-border rounded-lg p-8 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
          Cadastre o que você vende e pare de garimpar manualmente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              number: "1",
              title: "Informe suas palavras-chave",
              description:
                "Comece com produtos ou serviços que sua empresa oferece. A busca inteligente ajuda a encontrar oportunidades além do termo exato.",
            },
            {
              number: "2",
              title: "Ative o teste e receba alertas",
              description:
                "Crie sua conta grátis por 14 dias e receba oportunidades por e-mail, com links para o edital ou a página oficial.",
            },
            {
              number: "3",
              title: "Refine para ficar mais certeiro",
              description:
                "Ajuste regiões, horários, termos e estilo dos e-mails. Use favoritos, notas e exclusões para organizar seu pipeline.",
            },
          ].map((step, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-start">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-center">
            Escolha como começar
          </h2>
          <p className="text-center text-foreground/70 mb-12 text-lg max-w-2xl mx-auto">
            Todos os planos liberam os mesmos recursos; o que muda é o período
            (1, 3, 6, 12 meses). No teste grátis, você confere se os resultados
            fazem sentido antes de assinar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                period: "1 mês",
                description: "Para começar com calma",
                highlight: false,
              },
              {
                period: "3 meses",
                description: "Mais tempo para validar",
                highlight: false,
              },
              {
                period: "6 meses",
                description: "Economia melhor",
                highlight: false,
              },
              {
                period: "12 meses",
                description: "Melhor custo proporcional + 1 mês GRÁTIS!",
                highlight: true,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-8 text-center relative ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground ring-2 ring-primary"
                    : "bg-background border-2 border-border"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Mais vendido
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.period}</h3>
                <p className={plan.highlight ? "opacity-90" : "text-foreground/70"}>
                  {plan.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
          Para quem quer vender melhor para o governo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🎯",
              title: "Prestadores de serviços",
              description:
                "Encontre oportunidades que fazem sentido sem conferir tudo manualmente.",
            },
            {
              icon: "📦",
              title: "Fornecedores",
              description:
                "Filtre por região, modalidade e valor para agir com foco.",
            },
            {
              icon: "🤝",
              title: "Consultorias",
              description:
                "Organize oportunidades de clientes com favoritos, notas e comentários.",
            },
            {
              icon: "💼",
              title: "Escritórios",
              description:
                "Programe alertas para a equipe receber quando pode agir.",
            },
          ].map((audience, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 border border-border text-center">
              <div className="text-4xl mb-3">{audience.icon}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {audience.title}
              </h3>
              <p className="text-sm text-foreground/70">{audience.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "O que é o Inteligência Licitatória?",
                a: "É uma ferramenta automática que monitora os portais de licitações públicas, organiza as oportunidades e ajuda você a separar o que realmente combina com o que sua empresa vende.",
              },
              {
                q: "Como funciona o teste grátis de 14 dias?",
                a: "Basta informar seu e-mail e ativar o teste. Durante 14 dias você usa todos os recursos do sistema sem cobranças. Ao término, nada é cobrado automaticamente.",
              },
              {
                q: "Como começo a receber alertas por e-mail?",
                a: "Cadastre palavras-chave relacionadas ao que sua empresa vende. Depois do cadastro, você pode ajustar regiões, horários e o estilo dos e-mails nas configurações.",
              },
              {
                q: "A busca depende só da palavra-chave exata?",
                a: "Não. As palavras-chave continuam importantes, mas a IA ajuda a ampliar a busca e encontrar oportunidades relacionadas que uma busca literal poderia deixar passar.",
              },
              {
                q: "Posso filtrar por região, modalidade e valor?",
                a: "Sim. No painel você pode aplicar filtros por estado, modalidade, datas e faixas de valores. Também pode salvar preferências para deixar os próximos alertas mais focados.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="border border-border rounded-lg p-6 group cursor-pointer"
              >
                <summary className="font-semibold text-foreground flex justify-between items-center">
                  {faq.q}
                  <span className="transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="text-foreground/70 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Teste grátis por 14 dias. Sem cartão de crédito, sem compromisso.
          </p>
          <button
            onClick={() => setIsTrialModalOpen(true)}
            className="bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-lg"
          >
            Começar teste grátis
          </button>
        </div>
      </section>

      <TrialModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
