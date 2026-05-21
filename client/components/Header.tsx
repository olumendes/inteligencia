import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F966305ad014140afa20803745384ad62%2F87be7ae9a2634606beed69c714d05cf9?format=webp&width=800&height=1200"
            alt="Inteligência Licitatória"
            className="h-12 md:h-16 lg:h-20 w-auto"
            loading="eager"
            decoding="sync"
          />
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex absolute md:static top-full left-0 right-0 md:top-auto md:left-auto md:right-auto flex-col md:flex-row gap-4 md:gap-6 bg-background md:bg-transparent border-b md:border-b-0 border-border p-4 md:p-0`}
        >
          <a
            href="#features"
            className="text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Recursos
          </a>
          <a
            href="#how-it-works"
            className="text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Como Funciona
          </a>
          <a
            href="#faq"
            className="text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            FAQ
          </a>
        </nav>

        <button className="hidden md:block bg-primary text-primary-foreground px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex-shrink-0">
          Começar
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border p-4">
          <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Começar
          </button>
        </div>
      )}
    </header>
  );
}
