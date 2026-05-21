export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="font-bold text-lg mb-4">Siga-nos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://www.instagram.com/inteligencia.licitatoria?igsh=aGJmZ2VuNDYybnFh&utm_source=qr" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://x.com/licitatoriainte" className="hover:underline">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/licitatoriainte" className="hover:underline">
                  Twitter/X
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Informações</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Documentação
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-secondary-foreground/20 pt-8">
          <p className="text-sm opacity-75 mb-2">
            © 2024 Inteligência Licitatória. Todos os direitos reservados.
          </p>
          <p className="text-xs opacity-60">
            Inteligência Licitatória limita-se à prestação de serviço de busca
            automática de licitações públicas. Sempre consulte o edital oficial
            e cumpra os prazos legais.
          </p>
        </div>
      </div>
    </footer>
  );
}
