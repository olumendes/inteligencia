import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F966305ad014140afa20803745384ad62%2F87be7ae9a2634606beed69c714d05cf9?format=webp&width=800&height=1200"
            alt="Inteligência Licitatória"
            className="h-32 w-auto"
            loading="eager"
            decoding="sync"
          />
        </Link>
        <nav className="flex gap-6">
          <a
            href="#features"
            className="text-foreground hover:text-primary transition-colors"
          >
            Recursos
          </a>
          <a
            href="#how-it-works"
            className="text-foreground hover:text-primary transition-colors"
          >
            Como Funciona
          </a>
          <a
            href="#faq"
            className="text-foreground hover:text-primary transition-colors"
          >
            FAQ
          </a>
        </nav>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          Começar
        </button>
      </div>
    </header>
  );
}
