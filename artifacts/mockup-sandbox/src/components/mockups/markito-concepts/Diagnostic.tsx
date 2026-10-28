import React from 'react';
import { ArrowRight, MessageCircle, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Store, Instagram, MapPin, Search, Smartphone } from 'lucide-react';

export function Diagnostic() {
  const recommendations = [
    {
      id: 1,
      title: "Ative o Google Meu Negócio",
      description: "Sua farmácia não aparece nas buscas locais. Isso faz você perder vendas diárias.",
      icon: <Search className="w-5 h-5 text-red-500" />,
      color: "bg-red-50 border-red-100",
      textColor: "text-red-700",
      urgency: "Urgente"
    },
    {
      id: 2,
      title: "Poste 3x por semana",
      description: "Sua frequência atual é de 1 post/semana. Use os cards prontos da Rede para engajar mais.",
      icon: <Instagram className="w-5 h-5 text-orange-500" />,
      color: "bg-orange-50 border-orange-100",
      textColor: "text-orange-700",
      urgency: "Recomendado"
    },
    {
      id: 3,
      title: "Configure WhatsApp Business",
      description: "Automatize mensagens de boas-vindas e catálogo de produtos para acelerar o atendimento.",
      icon: <Smartphone className="w-5 h-5 text-teal-600" />,
      color: "bg-teal-50 border-teal-100",
      textColor: "text-teal-700",
      urgency: "Oportunidade"
    }
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center p-4 bg-gray-50 font-['Outfit',sans-serif]">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#00ACA9] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <img 
              src="/__mockup/images/logo-farmacias.png" 
              alt="Farmácias Associadas" 
              className="h-8 object-contain brightness-0 invert"
            />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <img 
              src="/__mockup/images/azito-mascot.png" 
              alt="Markito" 
              className="w-14 h-14 object-cover rounded-full border-2 border-white shadow-md bg-white"
            />
            <div>
              <h1 className="text-xl font-bold leading-tight">Diagnóstico Concluído</h1>
              <p className="text-teal-100 text-sm">Analisamos sua presença digital</p>
            </div>
          </div>
        </div>

        {/* User Context */}
        <div className="px-6 py-4 bg-teal-50/50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-900 font-semibold text-sm flex items-center gap-1.5">
              <Instagram className="w-4 h-4 text-gray-500" />
              @farmaciasaojose
            </span>
            <span className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              Curitiba, PR
            </span>
          </div>
          <button className="text-xs font-semibold text-[#00ACA9] bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
            Alterar
          </button>
        </div>

        {/* Scorecard */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Nota Geral</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gray-900">6.2</span>
                <span className="text-gray-400 font-medium">/10</span>
              </div>
              <span className="text-orange-500 text-xs font-medium mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Precisa de atenção
              </span>
            </div>
            
            {/* Circular Progress Mock */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EC6608"
                  strokeWidth="3"
                  strokeDasharray="62, 100"
                />
              </svg>
              <BarChart3 className="absolute w-6 h-6 text-[#EC6608]" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-gray-700">Frequência de posts</span>
                <span className="text-orange-500">4/10</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-gray-700">Identidade visual</span>
                <span className="text-teal-600">8/10</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-gray-700">Engajamento</span>
                <span className="text-orange-500">5/10</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-gray-700">Aparição no Google</span>
                <span className="text-red-500">2/10</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00ACA9]" />
            Prioridades para hoje
          </h3>
          
          <div className="flex flex-col gap-3">
            {recommendations.map((rec) => (
              <button 
                key={rec.id}
                className={`text-left p-4 rounded-2xl border ${rec.color} transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col gap-2 relative overflow-hidden group`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    {rec.icon}
                    <span className={`text-xs font-bold ${rec.textColor}`}>{rec.urgency}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${rec.textColor} opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1`} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{rec.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{rec.description}</p>
                </div>
              </button>
            ))}
          </div>

          <button className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-[#00ACA9] transition-colors py-2">
            <MessageCircle className="w-4 h-4" />
            ou prefere conversar livremente?
          </button>
        </div>

      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2 opacity-60">
        <img 
          src="/__mockup/images/logo-farmacias.png" 
          alt="Farmácias Associadas" 
          className="h-6 object-contain grayscale"
        />
        <p className="text-[10px] text-gray-500 font-medium">
          © 2026 Farmácias Associadas. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
