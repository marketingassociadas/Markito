import React from 'react';
import { Calendar, ChevronRight, Download, Sparkles, MessageCircle, CheckCircle2, Clock, CalendarClock, Play, MoreHorizontal } from 'lucide-react';

export function WeekPlan() {
  const weekDays = [
    { day: '11', name: 'Seg', type: 'Oferta de amigo', status: 'posted' },
    { day: '12', name: 'Ter', type: 'Vitrine Digital', status: 'posted' },
    { day: '13', name: 'Qua', type: 'Reels Marca Própria', status: 'today' },
    { day: '14', name: 'Qui', type: 'Dica de Saúde', status: 'scheduled' },
    { day: '15', name: 'Sex', type: 'Blog', status: 'pending' },
    { day: '16', name: 'Sáb', type: 'Livre', status: 'pending' },
    { day: '17', name: 'Dom', type: 'Livre', status: 'pending' },
  ];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center bg-[#f8fafc] font-['Outfit',sans-serif] relative overflow-hidden">
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px rgba(0, 172, 169, 0.08);
        }
        .gradient-text {
          background: linear-gradient(135deg, #00ACA9, #007977);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-br from-[#00ACA9] to-[#007977] rounded-b-[3rem] opacity-90 pointer-events-none"></div>
      
      <div className="w-full max-w-[420px] flex flex-col relative z-10 p-5 pt-8 pb-24 min-h-[100dvh]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white tracking-tight">Plano da Semana</h1>
            <p className="text-white/80 text-sm font-medium">11 a 17 de Maio de 2026</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg border-2 border-white/20">
            <img 
              src="/__mockup/images/azito-mascot.png" 
              alt="Markito" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Today Highlight */}
        <div className="glass-card rounded-[2rem] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#EC6608]/10 text-[#EC6608] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Hoje, Quarta
            </span>
            <span className="text-gray-400 text-sm font-medium">13 de Maio</span>
          </div>
          
          <h2 className="text-xl font-bold text-slate-800 leading-tight mb-2">
            Reels de Marca Própria + Produto
          </h2>
          <p className="text-slate-500 text-sm mb-5 leading-relaxed">
            Destaque os benefícios dos produtos de marca própria da Rede Farmácias Associadas em um vídeo curto.
          </p>

          {/* Thumbnail/Preview */}
          <div className="w-full aspect-video bg-slate-100 rounded-2xl mb-5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex flex-col justify-end p-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-2">
                <Play className="w-5 h-5 text-white fill-white ml-1" />
              </div>
              <p className="text-white font-medium text-sm drop-shadow-md">Ideia de Roteiro: Água Micelar</p>
            </div>
            {/* Placeholder pattern for thumbnail */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00ACA9_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button className="w-full bg-[#00ACA9] hover:bg-[#009b98] text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#00ACA9]/30 active:scale-[0.98]">
              <Download className="w-5 h-5" />
              Pegar materiais no Portal
            </button>
            <button className="w-full bg-white hover:bg-slate-50 text-[#EC6608] border border-[#EC6608]/20 font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
              <Sparkles className="w-5 h-5" />
              Adaptar com Markito
            </button>
          </div>
        </div>

        {/* 7-Day Strip */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold text-slate-800">Calendário</h3>
            <button className="text-[#00ACA9] text-sm font-semibold flex items-center gap-1 hover:opacity-80">
              Ver tudo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className={`flex items-center p-3 rounded-2xl transition-all ${
                  day.status === 'today' 
                    ? 'bg-white border-2 border-[#00ACA9] shadow-md' 
                    : 'bg-white/60 border border-slate-200 hover:bg-white'
                }`}
              >
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl mr-4 ${
                  day.status === 'today' ? 'bg-[#00ACA9] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className="text-xs font-semibold uppercase">{day.name}</span>
                  <span className="text-lg font-bold leading-none">{day.day}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${day.status === 'today' ? 'text-slate-800' : 'text-slate-700'}`}>
                    {day.type}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {day.status === 'posted' && <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">Postado</span></>}
                    {day.status === 'today' && <><Sparkles className="w-3.5 h-3.5 text-[#EC6608]" /><span className="text-xs text-[#EC6608] font-medium">Ação necessária</span></>}
                    {day.status === 'scheduled' && <><Clock className="w-3.5 h-3.5 text-blue-500" /><span className="text-xs text-blue-600 font-medium">Agendado</span></>}
                    {day.status === 'pending' && <><CalendarClock className="w-3.5 h-3.5 text-slate-400" /><span className="text-xs text-slate-500 font-medium">Pendente</span></>}
                  </div>
                </div>
                
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 left-0 w-full px-5 flex justify-center z-50">
          <button className="max-w-[420px] w-full bg-[#1a1a1a] hover:bg-black text-white rounded-full p-4 flex items-center justify-center gap-3 shadow-2xl shadow-black/20 transition-transform active:scale-[0.98] border border-white/10">
            <MessageCircle className="w-5 h-5 text-[#00e5e1]" />
            <span className="font-semibold">Conversar com Markito</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8 pb-10 flex flex-col items-center justify-center gap-3 opacity-60">
          <img 
            src="/__mockup/images/logo-farmacias.png" 
            alt="Farmácias Associadas" 
            className="h-8 object-contain grayscale"
          />
          <p className="text-[10px] text-slate-500 font-medium tracking-wide text-center">
            © 2026 Farmácias Associadas. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </div>
  );
}
