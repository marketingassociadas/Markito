import React, { useState } from 'react';
import { Flame, Star, Trophy, MessageCircle, Instagram, MapPin, Users, Play, ChevronRight, X, Send } from 'lucide-react';

export function Missions() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMission, setChatMission] = useState('');

  const openChat = (missionName: string) => {
    setChatMission(missionName);
    setChatOpen(true);
  };

  const missions = [
    {
      id: 1,
      title: "Postar 3 vezes essa semana",
      progress: 1,
      total: 3,
      xp: 50,
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
      color: "bg-pink-100",
      progressColor: "bg-pink-500",
    },
    {
      id: 2,
      title: "Responder todos os comentários",
      progress: 4,
      total: 12,
      xp: 20,
      icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-100",
      progressColor: "bg-blue-500",
    },
    {
      id: 3,
      title: "Ativar Google Meu Negócio",
      progress: 0,
      total: 1,
      xp: 100,
      icon: <MapPin className="w-5 h-5 text-green-500" />,
      color: "bg-green-100",
      progressColor: "bg-green-500",
    },
    {
      id: 4,
      title: "Ganhar 50 seguidores",
      progress: 12,
      total: 50,
      xp: 50,
      icon: <Users className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-100",
      progressColor: "bg-purple-500",
    }
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8fafc] font-['Outfit',sans-serif] relative overflow-hidden flex flex-col items-center">
      <style>{`
        .glass-header {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 172, 169, 0.1);
        }
        .mission-card {
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: all 0.2s ease;
        }
        .mission-card:active {
          transform: scale(0.98);
        }
        .streak-badge {
          background: linear-gradient(135deg, #FFF0E5 0%, #FFE4D6 100%);
          border: 1px solid #FFD5BE;
        }
        .xp-badge {
          background: linear-gradient(135deg, #E5F7F6 0%, #D6F2F0 100%);
          border: 1px solid #BEEAE8;
        }
        .progress-bg {
          background: #f1f5f9;
        }
      `}</style>

      {/* Top Header - Sticky */}
      <div className="w-full max-w-[420px] sticky top-0 z-20 glass-header px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/__mockup/images/azito-mascot.png" 
            alt="Markito" 
            className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Markito</h1>
            <span className="text-[10px] font-bold text-[#00ACA9] uppercase tracking-wider">Coach Digital</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="streak-badge px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-[#EC6608]" fill="#EC6608" />
            <span className="text-xs font-bold text-[#EC6608]">4 sem</span>
          </div>
          <div className="xp-badge px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 text-[#00ACA9]" fill="#00ACA9" />
            <span className="text-xs font-bold text-[#00ACA9]">1,250</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[420px] flex-1 flex flex-col p-4 gap-6 pb-20 relative z-10">
        
        {/* Welcome Coach Message */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ACA9] opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Pronto para a semana?</h2>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Você está indo super bem! Complete as missões dessa semana para subir para o nível <strong>Especialista</strong>.
            </p>
          </div>
        </div>

        {/* Missions List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="text-base font-bold text-gray-900">Missões da Semana</h3>
            <span className="text-xs font-semibold text-gray-500">1/4 concluídas</span>
          </div>

          {missions.map((mission) => (
            <div key={mission.id} className="bg-white rounded-2xl p-4 mission-card border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mission.color}`}>
                  {mission.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{mission.title}</h4>
                    <div className="flex items-center gap-0.5 bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-700 flex-shrink-0">
                      <Star className="w-3 h-3" fill="currentColor" />
                      <span className="text-[10px] font-bold">+{mission.xp}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full progress-bg overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${mission.progressColor}`}
                        style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 tabular-nums">
                      {mission.progress}/{mission.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-1 pt-3 border-t border-gray-50 flex items-center justify-between">
                <button 
                  onClick={() => openChat(mission.title)}
                  className="text-xs font-bold text-[#00ACA9] flex items-center gap-1 hover:opacity-80 active:scale-95 transition-all"
                >
                  <Play className="w-3 h-3" fill="currentColor" />
                  Como fazer? (Ajuda do Markito)
                </button>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Card */}
        <div className="bg-[#00ACA9] rounded-2xl p-4 text-white shadow-lg shadow-[#00ACA9]/20 relative overflow-hidden mt-2">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full mix-blend-overlay -mr-10 -mt-10 blur-2xl"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-white/90">Suas conquistas</p>
              <p className="text-lg font-bold">8 missões completadas</p>
            </div>
          </div>
        </div>

        {/* Free Chat Link */}
        <div className="flex justify-center mt-2 pb-4">
          <button 
            onClick={() => openChat('Conversa livre')}
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5 px-4 py-2 bg-gray-100 rounded-full"
          >
            <MessageCircle className="w-4 h-4" />
            Falar com Markito sobre algo livre
          </button>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-center gap-3 mt-4 opacity-60">
          <img 
            src="/__mockup/images/logo-farmacias.png" 
            alt="Farmácias Associadas" 
            className="h-8 object-contain grayscale"
          />
          <p className="text-[10px] text-gray-500 font-medium tracking-wide">
            © 2026 Farmácias Associadas. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Chat Overlay */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[420px] bg-white h-[90dvh] mt-auto rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00ACA9]/10 rounded-full flex items-center justify-center">
                  <img src="/__mockup/images/azito-mascot.png" alt="Markito" className="w-8 h-8 object-cover rounded-full" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Markito</h3>
                  <p className="text-[11px] text-[#00ACA9] font-semibold truncate max-w-[200px]">
                    Coach: {chatMission}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#f8fafc]">
              
              <div className="flex items-end gap-2">
                <img src="/__mockup/images/azito-mascot.png" alt="Markito" className="w-8 h-8 rounded-full border border-white shadow-sm" />
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-3 shadow-sm max-w-[80%]">
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    Olá! Vi que você quer ajuda com a missão <strong>"{chatMission}"</strong>. 
                  </p>
                </div>
              </div>
              
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 flex-shrink-0" /> {/* Spacer */}
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-3 shadow-sm max-w-[80%]">
                  <p className="text-sm text-gray-800 font-medium leading-relaxed">
                    O primeiro passo é planejar o conteúdo. Você prefere falar sobre produtos em promoção ou dar uma dica de saúde?
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pl-10 mt-2">
                <button className="bg-white border border-[#00ACA9] text-[#00ACA9] text-sm font-semibold p-2.5 rounded-xl shadow-sm text-left active:scale-95 transition-transform">
                  Falar sobre produtos em promoção
                </button>
                <button className="bg-white border border-[#00ACA9] text-[#00ACA9] text-sm font-semibold p-2.5 rounded-xl shadow-sm text-left active:scale-95 transition-transform">
                  Dar uma dica de saúde
                </button>
                <button className="bg-white border border-[#00ACA9] text-[#00ACA9] text-sm font-semibold p-2.5 rounded-xl shadow-sm text-left active:scale-95 transition-transform">
                  Outro assunto
                </button>
              </div>

            </div>

            <div className="p-3 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Escreva sua mensagem..." 
                  className="w-full bg-gray-100 border-transparent rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACA9]/50 font-medium text-gray-900 placeholder:text-gray-500"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-full bg-[#EC6608] flex items-center justify-center text-white active:scale-95 transition-transform">
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
