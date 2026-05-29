import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

interface Boletim {
  id: string;
  titulo: string;
  data: string;
  descricao: string;
}

// Mock data - substitua com dados reais do Python
const mockBoletins: Boletim[] = [
  {
    id: "1",
    titulo: "Boletim de Licitações",
    data: "2024-01-15",
    descricao: "5 novas licitações publicadas"
  },
  {
    id: "2",
    titulo: "Atualização de Editais",
    data: "2024-01-15",
    descricao: "2 editais atualizados"
  },
  {
    id: "3",
    titulo: "Boletim Semanal",
    data: "2024-01-18",
    descricao: "Resumo da semana - 12 licitações"
  },
  {
    id: "4",
    titulo: "Avisos Importantes",
    data: "2024-01-20",
    descricao: "3 prazos expiram em breve"
  },
];

export default function Calendario() {
  const navigate = useNavigate();
  const { email } = useParams<{ email?: string }>();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Obter boletins do dia selecionado
  const getDayBoletins = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split("T")[0];
    return mockBoletins.filter((b) => b.data === dateStr);
  };

  // Gerar dias do calendário
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar onLogout={handleLogout} userEmail={email} />

      <main className="flex-1">
        <header className="bg-white border-b border-border sticky top-0 z-10">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
            <p className="text-foreground/60 mt-2">
              Visualize os boletins enviados por data
            </p>
          </div>
        </header>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendário */}
            <div className="lg:col-span-2 bg-white border border-border rounded-lg p-6">
              {/* Header do calendário */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-foreground capitalize">
                  {monthName}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-foreground/60 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias */}
              <div className="grid grid-cols-7 gap-2">
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {calendarDays.map((day) => {
                  const boletins = getDayBoletins(day);
                  const hasBoletins = boletins.length > 0;

                  return (
                    <button
                      key={day}
                      className={cn(
                        "aspect-square p-2 rounded-lg border transition-colors flex flex-col items-center justify-center text-sm font-medium",
                        hasBoletins
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-background border-border text-foreground hover:bg-background/80"
                      )}
                    >
                      <span>{day}</span>
                      {hasBoletins && (
                        <Mail className="w-3 h-3 mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boletins do dia */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Boletins Recebidos
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mockBoletins.length > 0 ? (
                  mockBoletins.map((boletim) => (
                    <div
                      key={boletim.id}
                      className="p-3 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {boletim.titulo}
                          </p>
                          <p className="text-xs text-foreground/60">
                            {new Date(boletim.data).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="text-xs text-foreground/70 mt-1">
                            {boletim.descricao}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground/60 text-center py-8">
                    Nenhum boletim recebido
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
