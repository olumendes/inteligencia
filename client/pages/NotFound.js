import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function NotFound() {
    return (<div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Desculpe, a página que você está procurando não existe. Continue
            navegando para descobrir mais sobre o Inteligência Licitatória.
          </p>
          <Link to="/" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Voltar para a Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>);
}
