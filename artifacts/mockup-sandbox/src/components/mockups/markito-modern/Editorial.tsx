import React, { useState } from "react";
import { Magnet, Smartphone, CreditCard, Megaphone, Send } from "lucide-react";

export function Editorial() {
  const [inputValue, setInputValue] = useState("");

  const suggestions = [
    "Como vender mais no WhatsApp",
    "Como aparecer no Google",
    "Ideias de post para farmácia",
    "Como divulgar promoções",
    "Como usar os cards da rede",
  ];

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F4F1EB] text-[#2D2A26] font-['Inter']">
      <div className="w-full max-w-[420px] min-h-[100dvh] flex flex-col relative bg-[#FDFBF7] shadow-xl overflow-hidden">
        
        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-40 flex flex-col scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          
          {/* Header */}
          <div className="flex flex-col mb-10">
            <h1 className="font-['Fraunces'] text-6xl font-normal tracking-tighter leading-none text-[#00ACA9] mb-3">
              Markito
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-[1px] bg-[#EC6608] flex-1"></div>
              <span className="font-['Fraunces'] text-sm italic text-[#EC6608] uppercase tracking-widest flex-shrink-0">
                Assistente de Marketing
              </span>
            </div>
          </div>

          {/* Large Mascot Treatment */}
          <div className="relative w-full flex justify-center mb-10">
            <div className="w-[85%] aspect-square relative">
              <div className="absolute inset-0 bg-[#EC6608] rounded-full translate-x-2 translate-y-2 mix-blend-multiply opacity-20"></div>
              <div className="absolute inset-0 bg-[#00ACA9] rounded-full -translate-x-2 -translate-y-2 mix-blend-multiply opacity-20"></div>
              <img 
                src="/__mockup/images/azito-mascot.png" 
                alt="Markito" 
                className="w-full h-full object-cover rounded-full border border-[#2D2A26]/5 grayscale-[20%] contrast-125"
              />
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-12">
            <p className="font-['Fraunces'] text-2xl leading-snug text-[#2D2A26] mb-4">
              Olá! Sou o Markito, <span className="italic text-[#00ACA9]">assistente de marketing digital</span> da Rede Farmácias Associadas.
            </p>
            <p className="text-base text-[#2D2A26]/80 font-light leading-relaxed">
              Estou aqui para ajudar a sua farmácia a fortalecer a presença digital e atrair mais clientes. 
              <br/><br/>
              <strong className="font-semibold text-[#EC6608]">Como posso ajudar hoje?</strong>
            </p>
          </div>

          {/* Asymmetric Grid for Intents */}
          <div className="grid grid-cols-2 gap-4 mb-14">
            <button className="col-span-2 bg-[#00ACA9] text-white p-6 flex items-center gap-5 transition-transform active:scale-[0.98] border border-transparent hover:border-[#2D2A26] group">
              <Magnet className="w-8 h-8 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-left font-['Fraunces'] text-xl leading-tight">Atrair mais clientes</span>
            </button>
            <button className="bg-[#EAF6F6] text-[#00ACA9] p-5 flex flex-col justify-between aspect-square transition-transform active:scale-[0.98] border border-transparent hover:border-[#00ACA9]">
              <Smartphone className="w-7 h-7 mb-4" />
              <span className="text-left font-medium leading-snug">Melhorar meu Instagram</span>
            </button>
            <button className="bg-[#FDF2EC] text-[#EC6608] p-5 flex flex-col justify-between aspect-square transition-transform active:scale-[0.98] border border-transparent hover:border-[#EC6608]">
              <CreditCard className="w-7 h-7 mb-4" />
              <span className="text-left font-medium leading-snug">Criar anúncios e campanhas</span>
            </button>
            <button className="col-span-2 bg-[#EC6608] text-white p-6 flex items-center gap-5 transition-transform active:scale-[0.98] border border-transparent hover:border-[#2D2A26] group">
              <Megaphone className="w-8 h-8 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-left font-['Fraunces'] text-xl leading-tight">O que postar essa semana</span>
            </button>
          </div>

          {/* Suggestions Links */}
          <div className="mb-12">
            <h3 className="font-['Inter'] text-[10px] font-bold tracking-[0.2em] uppercase text-[#2D2A26]/40 mb-5 border-b border-[#2D2A26]/10 pb-2">
              Pesquisas Frequentes
            </h3>
            <div className="flex flex-col gap-3">
              {suggestions.map((s, i) => (
                <button key={i} className="text-left group flex items-baseline gap-2">
                  <span className="text-[#EC6608] text-xs font-bold opacity-50 group-hover:opacity-100 transition-opacity">{(i + 1).toString().padStart(2, '0')}</span>
                  <span className="text-sm font-medium text-[#2D2A26]/80 group-hover:text-[#00ACA9] transition-colors decoration-1 underline-offset-4 group-hover:underline">
                    {s}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 flex flex-col items-center gap-5 opacity-40 mix-blend-multiply">
            <img src="/__mockup/images/logo-farmacias.png" alt="Farmácias Associadas" className="h-6 object-contain grayscale" />
            <p className="text-[10px] text-center font-medium tracking-widest uppercase">
              © 2026 Farmácias Associadas
            </p>
          </div>
        </div>

        {/* Fixed Input at bottom */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent pt-12 pb-6 px-6">
          <form 
            onSubmit={(e) => { e.preventDefault(); setInputValue(""); }} 
            className="flex items-center gap-0 bg-[#FDFBF7] p-1 border-2 border-[#2D2A26] shadow-[4px_4px_0px_0px_#2D2A26] transition-all focus-within:translate-x-[2px] focus-within:translate-y-[2px] focus-within:shadow-[2px_2px_0px_0px_#2D2A26]"
          >
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta..." 
              className="flex-1 bg-transparent px-4 py-3 text-sm font-medium focus:outline-none placeholder:text-[#2D2A26]/40 text-[#2D2A26]"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-[#2D2A26] text-white p-3.5 flex items-center justify-center transition-colors disabled:opacity-50 hover:bg-[#00ACA9]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
