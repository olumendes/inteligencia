import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const whatsappNumber = "5531988131611";
  const message = encodeURIComponent(
    "Olá, estou no site e gostaria de mais informações sobre a Inteligência Licitatória"
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  const handleClick = () => {
    window.open(whatsappLink, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Contatar via WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center w-14 h-14"
    >
      <MessageCircle size={24} />
    </button>
  );
}
