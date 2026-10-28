import React from 'react';
import { Magnet, Smartphone, CreditCard, Megaphone, Send } from 'lucide-react';

export function Glass() {
  const intents = [
    {
      id: "customers",
      label: "Atrair mais clientes",
      icon: <Magnet className="w-6 h-6 text-white" />,
      gradient: "from-[#EC6608] to-[#ff8e3c]"
    },
    {
      id: "social",
      label: "Melhorar meu Instagram",
      icon: <Smartphone className="w-6 h-6 text-white" />,
      gradient: "from-[#EC6608] to-[#ff8e3c]"
    },
    {
      id: "ads",
      label: "Criar anúncios e campanhas",
      icon: <CreditCard className="w-6 h-6 text-white" />,
      gradient: "from-[#EC6608] to-[#ff8e3c]"
    },
    {
      id: "week",
      label: "O que postar essa semana",
      icon: <Megaphone className="w-6 h-6 text-white" />,
      gradient: "from-[#EC6608] to-[#ff8e3c]"
    },
  ];

  const suggestions = [
    "Como vender mais no WhatsApp",
    "Como aparecer no Google",
    "Ideias de post para farmácia",
    "Como divulgar promoções",
    "Como usar os cards da rede",
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 py-8 relative overflow-hidden bg-gradient-to-br from-[#00ACA9] via-[#008f8c] to-[#005c5a] font-['Outfit',sans-serif]">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }
        .glass-button {
          background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }
        .glass-pill {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#00e5e1] rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-[#EC6608] rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute top-[40%] left-[20%] w-[250px] h-[250px] bg-white rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="w-full max-w-[420px] flex flex-col gap-6 relative z-10">
        
        {/* Main Glass Panel */}
        <div className="glass-panel rounded-[2.5rem] p-6 flex flex-col gap-6 text-white">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-md">Markito</h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#EC6608] text-white shadow-lg shadow-[#EC6608]/30 uppercase tracking-widest">
              Assistente de Marketing Digital
            </span>
          </div>

          {/* Greeting Area */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
              <img 
                src="/__mockup/images/azito-mascot.png" 
                alt="Markito" 
                className="w-24 h-24 object-cover rounded-full border-4 border-white/50 shadow-2xl relative z-10 bg-white/20"
              />
            </div>
            
            <div className="glass-card rounded-2xl rounded-tl-sm p-4 mt-2 relative">
              <p className="text-[15px] leading-relaxed font-medium text-white/90 drop-shadow-sm">
                Olá! Sou o Markito, assistente de marketing digital da Rede Farmácias Associadas. Estou aqui para ajudar a sua farmácia a fortalecer a presença digital e atrair mais clientes. Como posso ajudar hoje?
              </p>
            </div>
          </div>

          {/* Intent Grid */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            {intents.map((intent) => (
              <button 
                key={intent.id}
                className="glass-button rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:bg-white/30 transition-all duration-300 active:scale-95 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${intent.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {intent.icon}
                </div>
                <span className="text-sm font-semibold leading-tight drop-shadow-md text-white">
                  {intent.label}
                </span>
              </button>
            ))}
          </div>

          {/* Chat Input Area */}
          <div className="mt-2 flex flex-col gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Digite sua pergunta aqui..." 
                className="w-full bg-white/20 backdrop-blur-md border border-white/40 rounded-full pl-5 pr-14 py-4 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner font-medium text-sm transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-gradient-to-r from-[#EC6608] to-[#ff8e3c] flex items-center justify-center shadow-lg shadow-[#EC6608]/40 hover:scale-105 active:scale-95 transition-all">
                <Send className="w-5 h-5 text-white ml-0.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Suggestion Pills */}
        <div className="w-full overflow-hidden">
          <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest ml-2 mb-3 drop-shadow-sm">Sugestões rápidas</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 px-2 -mx-2">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                className="glass-pill whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold text-white hover:bg-white/30 transition-colors shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-center gap-3 mt-4 opacity-80 mix-blend-screen">
          <img 
            src="/__mockup/images/logo-farmacias.png" 
            alt="Farmácias Associadas" 
            className="h-10 object-contain brightness-0 invert opacity-90"
          />
          <p className="text-[11px] text-white font-medium tracking-wide">
            © 2026 Farmácias Associadas. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </div>
  );
}
