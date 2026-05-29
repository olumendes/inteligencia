import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Licitacoes from "./pages/Licitacoes";
import Alertas from "./pages/Alertas";
import Orgaos from "./pages/Orgaos";
import Fornecedores from "./pages/Fornecedores";
import Listas from "./pages/Listas";
import Calendario from "./pages/Calendario";
import Planos from "./pages/Planos";
import Assinar from "./pages/Assinar";
import Configuracoes from "./pages/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/:email" element={<Dashboard />} />
          <Route path="/licitacoes" element={<Licitacoes />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/orgaos" element={<Orgaos />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/listas" element={<Listas />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/assinar" element={<Assinar />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
