import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  FileText,
  Building2,
  Users,
  Bell,
  Calendar,
  CreditCard,
  Settings,
  Crown,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  premium?: boolean;
  children?: NavItem[];
  onClick?: () => void;
}

interface SidebarProps {
  onLogout: () => void;
  userEmail?: string;
}

export default function Sidebar({ onLogout, userEmail }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("Minha Empresa");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      label: "Início",
      path: `/dashboard/${userEmail}`,
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Licitações",
      path: "/licitacoes",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Órgãos",
      path: "/orgaos",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      label: "Fornecedores",
      path: "/fornecedores",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Alertas",
      path: "/alertas",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      label: "Premium - Listas",
      path: "/listas",
      icon: <FileText className="w-5 h-5" />,
      premium: true,
    },
    {
      label: "Calendário",
      path: "/calendario",
      icon: <Calendar className="w-5 h-5" />,
      premium: true,
    },
    {
      label: "Planos",
      path: "/planos",
      icon: <CreditCard className="w-5 h-5" />,
      premium: true,
    },
    {
      label: "Assinar",
      path: "/assinar",
      icon: <Crown className="w-5 h-5" />,
    },
    {
      label: "Configurações",
      path: "/configuracoes",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleNavClick = (item: NavItem) => {
    if (item.path) {
      navigate(item.path);
      setIsOpen(false);
    }
    if (item.children) {
      toggleExpanded(item.label);
    }
  };

  const sidebarContent = (
    <nav className="h-full flex flex-col bg-white border-r border-border">
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-border">
        <img src="https://cdn.builder.io/api/v1/image/assets%2F7f3ad65aabb7489fb87ea0e0143e6440%2Fb675771a3d0a4f10b611cb0e5f666225?format=webp&width=800&height=1200" alt="Logo Inteligência Licitatória" className="h-12 w-auto" />
      </div>

      {/* Company Selector */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground/60 uppercase">
            Empresa
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 hover:bg-background rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <button className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-primary/5 transition-colors flex items-center justify-between">
          <span>{selectedCompany}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <div key={item.label}>
            <button
              onClick={() => handleNavClick(item)}
              className={cn(
                "w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-background"
              )}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.premium && (
                <Crown className="w-4 h-4 text-yellow-500" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            onLogout();
            setIsOpen(false);
          }}
          className="w-full px-4 py-2 flex items-center gap-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 hover:bg-background rounded-lg"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static top-0 left-0 h-screen w-64 z-40 transition-transform md:transition-none",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
