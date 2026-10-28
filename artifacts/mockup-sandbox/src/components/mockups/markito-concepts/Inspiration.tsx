import React, { useState } from 'react';
import { Search, Sparkles, MessageCircle, Heart, Share2, Play, Calendar, X, ArrowRight, Zap } from 'lucide-react';

export function Inspiration() {
  const [activeFilter, setActiveFilter] = useState('Tudo');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const filters = [
    'Tudo', 'Tendências', 'Esta semana', 'Datas comemorativas', 'Reels', 'Ofertas'
  ];

  const posts = [
    {
      id: 1,
      title: 'Promoção de Inverno: Vitamina C',
      category: 'Ofertas',
      type: 'image',
      color: 'from-orange-400 to-red-500',
      description: 'Template perfeito para destacar suplementos de imunidade. O layout já inclui espaço para o preço "de/por".',
      likes: 124,
      height: 'h-64'
    },
    {
      id: 2,
      title: 'Dica de Saúde: Cuidados com a pele no frio',
      category: 'Educativo',
      type: 'carousel',
      color: 'from-teal-400 to-emerald-500',
      description: 'Carrossel educativo que gera muito salvamento. Explica a importância da hidratação.',
      likes: 89,
      height: 'h-48'
    },
    {
      id: 3,
      title: 'Reels: Bastidores da farmácia',
      category: 'Reels',
      type: 'video',
      color: 'from-blue-400 to-indigo-500',
      description: 'Áudio em alta! Mostre a equipe organizando os produtos para criar conexão humana com os clientes.',
      likes: 215,
      height: 'h-72'
    },
    {
      id: 4,
      title: 'Sorteio Dia dos Pais',
      category: 'Datas',
      type: 'image',
      color: 'from-purple-400 to-pink-500',
      description: 'Arte pronta para o sorteio de kit masculino. Inclui regras sugeridas na legenda.',
      likes: 342,
      height: 'h-56'
    },
    {
      id: 5,
      title: 'Oferta de Amigo: Leve 3 Pague 2',
      category: 'Ofertas',
      type: 'image',
      color: 'from-[#EC6608] to-[#ff9e5e]',
      description: 'Estratégia agressiva para produtos de curva A. Design focado em conversão rápida no WhatsApp.',
      likes: 156,
      height: 'h-60'
    },
    {
      id: 6,
      title: 'Mito ou Verdade: Genéricos',
      category: 'Educativo',
      type: 'carousel',
      color: 'from-rose-400 to-orange-400',
      description: 'Combate objeções comuns sobre medicamentos genéricos de forma leve e informativa.',
      likes: 201,
      height: 'h-52'
    }
  ];

  const filteredPosts = activeFilter === 'Tudo' 
    ? posts 
    : posts.filter(p => {
      if (activeFilter === 'Tendências') return p.likes > 150;
      if (activeFilter === 'Esta semana') return ['Ofertas', 'Educativo'].includes(p.category);
      if (activeFilter === 'Datas comemorativas') return p.category === 'Datas';
      if (activeFilter === 'Reels') return p.category === 'Reels';
      return p.category === activeFilter;
    });

  // Masonry layout splitting
  const leftColumn = filteredPosts.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredPosts.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center bg-[#f8fafc] font-['Plus_Jakarta_Sans',sans-serif] relative pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          align-items: start;
        }
        .glass-nav {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(0, 172, 169, 0.1);
        }
      `}</style>

      <div className="w-full max-w-[420px] bg-white min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.05)] relative flex flex-col">
        
        {/* Header Section */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-gray-100 pb-2 pt-6 px-4 flex flex-col gap-4 shadow-sm">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight flex items-center gap-2">
                Markito <Sparkles className="w-5 h-5 text-[#EC6608]" />
              </h1>
              <p className="text-[11px] font-semibold text-[#00ACA9] uppercase tracking-widest mt-0.5">
                Feed de Inspiração
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Calendar className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchFocused ? 'text-[#00ACA9]' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Buscar ideias para postar..." 
              className="w-full bg-gray-50/80 border-2 border-transparent focus:border-[#00ACA9]/30 focus:bg-white rounded-2xl pl-10 pr-4 py-3 text-[14px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-bold transition-all shadow-sm ${
                  activeFilter === filter 
                    ? 'bg-[#00ACA9] text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Content Feed (Pinterest Style) */}
        <div className="flex-1 p-4 pb-24">
          <div className="masonry-grid">
            {/* Left Column */}
            <div className="flex flex-col gap-3">
              {leftColumn.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post.id)} />
              ))}
            </div>
            
            {/* Right Column */}
            <div className="flex flex-col gap-3">
              {rightColumn.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer info inside scroll area */}
        <div className="pb-32 pt-8 flex flex-col items-center justify-center gap-3 opacity-60">
          <img 
            src="/__mockup/images/logo-farmacias.png" 
            alt="Farmácias Associadas" 
            className="h-8 object-contain grayscale"
          />
          <p className="text-[10px] text-gray-500 font-medium tracking-wide">
            © 2026 Farmácias Associadas. Todos os direitos reservados.
          </p>
        </div>

        {/* Bottom Floating Action Area */}
        <div className="fixed bottom-0 w-full max-w-[420px] z-30">
          {/* Gradient fade above nav */}
          <div className="h-16 w-full bg-gradient-to-t from-white to-transparent pointer-events-none absolute bottom-full"></div>
          
          <div className="glass-nav px-4 py-4 flex items-center justify-between pb-safe">
            <button className="flex-1 bg-white border border-gray-200 shadow-sm text-gray-700 font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors text-[14px]">
              <MessageCircle className="w-4 h-4 text-[#EC6608]" />
              Conversar com Markito
            </button>
            
            <button className="ml-3 w-12 h-12 rounded-full shadow-[0_8px_20px_rgba(236,102,8,0.3)] bg-white border-2 border-white relative shrink-0 active:scale-95 transition-transform">
              <img 
                src="/__mockup/images/azito-mascot.png" 
                alt="Markito" 
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#00ACA9] border-2 border-white rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Post Preview Modal */}
        {selectedPost !== null && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
            <div 
              className="absolute inset-0" 
              onClick={() => setSelectedPost(null)}
            ></div>
            <div 
              className="w-full max-w-[420px] bg-white rounded-t-[2rem] sm:rounded-[2rem] h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col relative overflow-hidden animate-in slide-in-from-bottom-full duration-300"
              style={{ boxShadow: "0 -10px 40px rgba(0,0,0,0.1)" }}
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto flex-1 hide-scrollbar">
                {(() => {
                  const post = posts.find(p => p.id === selectedPost);
                  if (!post) return null;
                  return (
                    <div>
                      {/* Fake Image Area */}
                      <div className={`w-full h-[300px] bg-gradient-to-br ${post.color} relative flex items-center justify-center`}>
                        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm border border-white/20">
                          {post.category}
                        </div>
                        {post.type === 'video' ? (
                          <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40">
                            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                          </div>
                        ) : (
                          <div className="text-white/80 font-bold text-2xl tracking-tight opacity-50 px-8 text-center mix-blend-overlay">
                            {post.title}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-extrabold text-[#1a1a1a] leading-tight">
                            {post.title}
                          </h2>
                          <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                              <Heart className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 font-medium text-[15px] leading-relaxed mb-6">
                          {post.description}
                        </p>

                        <div className="bg-[#00ACA9]/5 border border-[#00ACA9]/20 rounded-2xl p-5 relative overflow-hidden">
                          <Sparkles className="absolute -right-4 -top-4 w-20 h-20 text-[#00ACA9] opacity-5" />
                          <h3 className="font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
                            <img src="/__mockup/images/azito-mascot.png" className="w-6 h-6 rounded-full" alt="Markito" />
                            Markito diz:
                          </h3>
                          <p className="text-sm text-gray-700 font-medium leading-relaxed mb-4">
                            Gostou dessa ideia? Eu posso adaptar a legenda, sugerir os produtos da sua farmácia e criar a arte final com o logotipo da Rede.
                          </p>
                          <button className="w-full bg-[#EC6608] hover:bg-[#d65a07] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#EC6608]/30 transition-all active:scale-[0.98]">
                            <Zap className="w-4 h-4 fill-current" />
                            Adaptar pra minha farmácia
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function PostCard({ post, onClick }: { post: any, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 cursor-pointer group hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-[0.98]"
    >
      <div className={`w-full ${post.height} bg-gradient-to-br ${post.color} relative overflow-hidden`}>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        
        {/* Category tag */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-gray-800 shadow-sm border border-white/50 uppercase tracking-wide">
          {post.category}
        </div>

        {/* Media type icon */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
          {post.type === 'video' ? <Play className="w-3 h-3 ml-0.5" fill="currentColor" /> : 
           post.type === 'carousel' ? <MessageCircle className="w-3 h-3" /> : 
           <Heart className="w-3 h-3" />}
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-[13px] font-bold text-[#1a1a1a] leading-snug mb-1 line-clamp-2 group-hover:text-[#00ACA9] transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 opacity-70">
            <Heart className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] font-semibold text-gray-500">{post.likes}</span>
          </div>
          <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-[#00ACA9]/10 transition-colors">
            <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-[#00ACA9]" />
          </div>
        </div>
      </div>
    </div>
  );
}
