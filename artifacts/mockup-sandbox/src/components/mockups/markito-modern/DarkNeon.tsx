import React, { useState } from "react";
import { Magnet, Smartphone, CreditCard, Megaphone, Send } from "lucide-react";
import "./DarkNeon.css";

const intents = [
  { id: "customers", label: "Atrair mais clientes", icon: Magnet },
  { id: "social", label: "Melhorar meu Instagram", icon: Smartphone },
  { id: "ads", label: "Criar anúncios e campanhas", icon: CreditCard },
  { id: "week", label: "O que postar essa semana", icon: Megaphone },
];

const suggestions = [
  "Como vender mais no WhatsApp",
  "Como aparecer no Google",
  "Ideias de post para farmácia",
  "Como divulgar promoções",
  "Como usar os cards da rede",
];

export function DarkNeon() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 font-geist relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 bg-grid-teal pointer-events-none opacity-50" />
      
      {/* Top ambient glow */}
      <div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[600px] h-[400px] rounded-full bg-[#00ACA9] opacity-[0.03] blur-[80px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[480px] bg-[#0f0f15]/80 backdrop-blur-2xl rounded-[2rem] border border-[#00ACA9]/20 shadow-[0_0_40px_rgba(0,172,169,0.05)] overflow-hidden flex flex-col relative z-10" style={{ height: "min(90vh, 800px)" }}>
        
        {/* Header */}
        <header className="pt-6 px-6 pb-4 border-b border-[#00ACA9]/10 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Markito
              <div className="h-2 w-2 rounded-full bg-[#00ACA9] shadow-[0_0_8px_#00ACA9]" />
            </h1>
            <span className="text-[11px] font-medium text-[#00ACA9] tracking-wide uppercase mt-1 neon-text-glow">
              Assistente de Marketing Digital
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6 pt-6 space-y-6">
          
          {/* Greeting */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[#00ACA9] rounded-full blur-md opacity-30" />
              <img 
                src="/__mockup/images/azito-mascot.png" 
                alt="Markito Mascot" 
                className="w-12 h-12 rounded-full relative z-10 border border-[#00ACA9]/30"
              />
            </div>
            <div className="bg-[#151520] border border-[#00ACA9]/20 rounded-2xl rounded-tl-sm p-4 text-gray-300 text-sm leading-relaxed shadow-lg">
              Olá! Sou o Markito, assistente de marketing digital da Rede Farmácias Associadas. Estou aqui para ajudar a sua farmácia a fortalecer a presença digital e atrair mais clientes. Como posso ajudar hoje?
            </div>
          </div>

          {/* Intent Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {intents.map((intent) => {
              const Icon = intent.icon;
              return (
                <button
                  key={intent.id}
                  className="neon-border bg-[#151520]/50 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center gap-3 group text-center"
                >
                  <div className="p-2 rounded-lg bg-[#00ACA9]/10 group-hover:bg-[#00ACA9]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#00ACA9]" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                    {intent.label}
                  </span>
                </button>
              );
            })}
          </div>

        </main>

        {/* Suggestions Strip */}
        <div className="shrink-0 pt-4 pb-3 border-t border-[#00ACA9]/10 bg-[#0f0f15]/90">
          <div className="px-5 mb-2">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
              Sugestões Rápidas
            </span>
          </div>
          <div className="overflow-x-auto hide-scrollbar px-5 pb-2">
            <div className="flex gap-2 w-max">
              {suggestions.map((sug, idx) => (
                <button 
                  key={idx}
                  className="px-4 py-1.5 rounded-full border border-gray-700 bg-gray-800/30 text-xs text-gray-400 hover:border-[#00ACA9]/50 hover:text-[#00ACA9] transition-colors whitespace-nowrap"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0a0a0f] shrink-0 border-t border-[#00ACA9]/10">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta aqui..."
              className="w-full bg-[#151520] border border-gray-800 focus:border-[#00ACA9]/50 focus:ring-1 focus:ring-[#00ACA9]/50 rounded-full pl-5 pr-14 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition-all"
            />
            <button 
              className={`absolute right-1.5 p-2.5 rounded-full transition-all flex items-center justify-center ${
                inputValue.trim() 
                  ? 'neon-orange-btn text-white' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full max-w-[480px] mt-6 flex flex-col items-center gap-3 relative z-10">
        <img 
          src="/__mockup/images/logo-farmacias.png" 
          alt="Farmácias Associadas" 
          className="h-10 opacity-70 grayscale contrast-125 brightness-150"
        />
        <p className="text-[10px] text-gray-500 text-center">
          © 2026 Farmácias Associadas. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}