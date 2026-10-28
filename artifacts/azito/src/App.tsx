import React, { useState, useEffect, useRef, useCallback } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
const AdminDashboard = React.lazy(() => import("@/pages/admin-dashboard"));
import Privacy from "@/pages/privacy";
import { PrivacyProof } from "@/components/privacy-proof";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Magnet,
  Smartphone,
  CreditCard,
  Send,
  Loader2,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Smile,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const queryClient = new QueryClient();

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

const URL_REGEX = /(https?:\/\/[^\s<>"')]+[^\s<>"').,;:!?])/g;

function renderWithLinks(text: string): React.ReactNode {
  if (!text) return text;
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold break-all"
          style={{ color: "#00ACA9" }}
          data-testid={`link-${i}`}
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function PrivacyConsentModal({ onAccept }: { onAccept: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-testid="modal-privacy"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[460px] p-7 flex flex-col items-center text-center"
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#00ACA915" }}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#00ACA9"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-extrabold text-[#0f3a39] mb-2">
          Política de Privacidade
        </h2>
        <p className="text-sm leading-relaxed text-[#1a3a3a] mb-6">
          Ao utilizar o Markito IA, você concorda com nossa{" "}
          <a
            href={`${BASE_URL}/privacidade`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00ACA9] font-semibold underline"
            data-testid="link-privacy-modal"
          >
            Política de Privacidade
          </a>{" "}
          e com o uso das interações para melhoria e treinamento da inteligência
          artificial.
        </p>
        <button
          onClick={onAccept}
          className="w-full text-sm font-bold text-white py-3 rounded-full transition-transform hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #00ACA9 0%, #008c89 100%)",
            boxShadow: "0 6px 20px rgba(0, 172, 169, 0.4)",
          }}
          data-testid="button-accept-privacy"
        >
          Concordar e continuar
        </button>
      </motion.div>
    </motion.div>
  );
}

function PrivacyConsentGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  return (
    <>
      {children}
      <AnimatePresence>
        {!accepted && (
          <PrivacyConsentModal onAccept={() => setAccepted(true)} />
        )}
      </AnimatePresence>
    </>
  );
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
};

type Intent = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  userMessage: string;
};

const intents: Intent[] = [
  {
    id: "customers",
    label: "Atrair mais clientes",
    description: "Estratégias para conquistar e fidelizar mais clientes.",
    icon: <Magnet className="w-5 h-5" style={{ color: "#00ACA9" }} />,
    userMessage: "Quero atrair mais clientes para a minha farmácia",
  },
  {
    id: "social",
    label: "Melhorar meu Instagram",
    description: "Dicas para posts, stories e engajamento.",
    icon: <Smartphone className="w-5 h-5" style={{ color: "#00ACA9" }} />,
    userMessage: "Quero melhorar o Instagram da minha farmácia",
  },
  {
    id: "ads",
    label: "Criar anúncios e campanhas",
    description: "Aprenda a anunciar e alcançar mais pessoas.",
    icon: <Megaphone className="w-5 h-5" style={{ color: "#00ACA9" }} />,
    userMessage: "Quero criar anúncios e campanhas para minha farmácia",
  },
  {
    id: "week",
    label: "O que postar essa semana",
    description: "Sugestões de conteúdos prontos para você.",
    icon: <CreditCard className="w-5 h-5" style={{ color: "#00ACA9" }} />,
    userMessage: "O que eu devo postar essa semana nas redes sociais da minha farmácia?",
  },
];

type Suggestion = {
  text: string;
  icon: React.ReactNode;
};

const suggestions: Suggestion[] = [
  {
    text: "Como vender mais no WhatsApp",
    icon: (
      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#25D366]">
        <MessageCircle className="w-3 h-3 text-white fill-white" />
      </span>
    ),
  },
  {
    text: "Como aparecer no Google",
    icon: (
      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white border border-gray-200 text-[11px] font-bold leading-none">
        <span style={{ color: "#4285F4" }}>G</span>
      </span>
    ),
  },
  {
    text: "Ideias de promoções para minha farmácia",
    icon: (
      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#00ACA915]">
        <TrendingUp className="w-3 h-3" style={{ color: "#00ACA9" }} />
      </span>
    ),
  },
  {
    text: "Como divulgar promoções",
    icon: (
      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#EC660815]">
        <Sparkles className="w-3 h-3" style={{ color: "#EC6608" }} />
      </span>
    ),
  },
  {
    text: "Como usar os cards da rede",
    icon: (
      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#00ACA915]">
        <CreditCard className="w-3 h-3" style={{ color: "#00ACA9" }} />
      </span>
    ),
  },
];

const Mascot = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const dim = size === "sm" ? "w-10 h-10" : "w-24 h-24";
  return (
    <div className={`relative ${dim} flex-shrink-0`}>
      <img
        src={`${import.meta.env.BASE_URL}azito-mascot.png?v=3`}
        alt="Markito"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s*/g, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/^---+$/gm, "")
    .replace(/^===+$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^>\s*/gm, "")
    .trim();
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const displayContent = isUser ? msg.content : stripMarkdown(msg.content);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && <Mascot size="sm" />}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "text-white rounded-br-sm"
            : "bg-[#f5fbfb] text-[#1a3a3a] rounded-bl-sm border border-[#00ACA920]"
        }`}
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #EC6608 0%, #ff8e3c 100%)",
                boxShadow: "0 4px 16px rgba(236, 102, 8, 0.25)",
              }
            : undefined
        }
        data-testid={`message-${msg.id}`}
      >
        {isUser ? displayContent : renderWithLinks(displayContent)}
        {msg.isStreaming && (
          <span
            className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm align-middle"
            style={{ backgroundColor: isUser ? "#fff" : "#00ACA9" }}
          />
        )}
      </div>
    </motion.div>
  );
}

function Home() {
  const [phase, setPhase] = useState<"welcome" | "chat">("welcome");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0, moved: false });
  const userScrolledUp = useRef(false);
  const justSentRef = useRef<string | null>(null);

  const onSuggestionMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = suggestionsRef.current;
    if (!el) return;
    dragState.current = { isDragging: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false };
    el.style.cursor = "grabbing";
  }, []);

  const onSuggestionMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = suggestionsRef.current;
    if (!el || !dragState.current.isDragging) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    if (Math.abs(walk) > 3) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  }, []);

  const onSuggestionMouseUp = useCallback(() => {
    const el = suggestionsRef.current;
    dragState.current.isDragging = false;
    if (el) el.style.cursor = "grab";
  }, []);


  const isNearBottom = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  const handleChatScroll = useCallback(() => {
    userScrolledUp.current = !isNearBottom();
  }, [isNearBottom]);

  const scrollToBottom = useCallback((force = false) => {
    if (!force && userScrolledUp.current) return;
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  const scrollQuestionToTop = useCallback((msgId: string) => {
    setTimeout(() => {
      const el = chatContainerRef.current?.querySelector(
        `[data-testid="message-${msgId}"]`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }, []);

  useEffect(() => {
    if (phase === "chat") {
      scrollToBottom(true);
      inputRef.current?.focus();
    }
  }, [phase, scrollToBottom]);

  useEffect(() => {
    if (phase === "chat" && chatMessages.length > 0) {
      if (justSentRef.current) return;
      scrollToBottom();
    }
  }, [phase, chatMessages.length, scrollToBottom]);

  const createConversation = async (title: string): Promise<number> => {
    const res = await fetch(`${BASE_URL}/api/openai/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (!res.ok || !Number.isSafeInteger(data.id)) throw new Error(data.error || "Não foi possível iniciar a conversa");
    return data.id as number;
  };

  const streamMessage = async (convId: number, userContent: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userContent,
    };
    const assistantId = `assistant-${Date.now() + 1}`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      isStreaming: true,
    };

    setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);
    userScrolledUp.current = false;
    justSentRef.current = userMsg.id;
    scrollQuestionToTop(userMsg.id);

    abortRef.current = new AbortController();

    try {
      const res = await fetch(
        `${BASE_URL}/api/openai/conversations/${convId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userContent }),
          signal: abortRef.current.signal,
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Não foi possível enviar a mensagem");
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              );
            }
            if (parsed.done) {
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m
                )
              );
            }
          } catch {
            // non-JSON line, skip
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: err instanceof Error ? err.message : "Desculpe, ocorreu um erro. Tente novamente.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      justSentRef.current = null;
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId && m.isStreaming
            ? {
                ...m,
                isStreaming: false,
                content:
                  m.content ||
                  "Desculpe, tive um probleminha para responder agora. Pode tentar novamente em instantes?",
              }
            : m
        )
      );
    }
  };

  const trackSuggestion = useCallback((text: string) => {
    fetch(`${BASE_URL}/api/admin/suggestion-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestion: text }),
    }).catch(() => {});
  }, []);

  const startChat = async (userContent: string) => {
    setPhase("chat");
    try {
      let convId = conversationId;
      if (!convId) {
        setIsStreaming(true);
        convId = await createConversation(userContent.slice(0, 60));
        setConversationId(convId);
      }
      await streamMessage(convId, userContent);
    } catch (err) {
      setIsStreaming(false);
      setChatMessages((previous) => [...previous, {
        id: `error-${Date.now()}`, role: "assistant",
        content: err instanceof Error ? err.message : "Não foi possível iniciar a conversa.",
      }]);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    setInputValue("");
    await startChat(text);
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setPhase("welcome");
    setChatMessages([]);
    setConversationId(null);
    setInputValue("");
    setIsStreaming(false);
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 pb-6 gap-5 relative overflow-hidden font-['Outfit',sans-serif]"
      style={{ background: "#00ACA9" }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .dot-pattern {
          background-image: radial-gradient(circle, rgba(0,172,169,0.35) 1px, transparent 1.5px);
          background-size: 14px 14px;
        }
      `}</style>

      {/* Decorative organic shapes */}
      <div
        className="absolute -left-32 top-1/4 w-[420px] h-[420px] rounded-full opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
      />
      <div
        className="absolute -right-32 bottom-1/4 w-[380px] h-[380px] rounded-full opacity-35 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
      />
      <div className="absolute top-12 left-12 w-20 h-20 dot-pattern opacity-60 pointer-events-none" />
      <div className="absolute bottom-32 right-16 w-24 h-24 dot-pattern opacity-60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] bg-white rounded-[2rem] flex flex-col relative z-10 overflow-hidden"
        style={{
          height: "min(88vh, 720px)",
          boxShadow:
            "0 30px 70px rgba(0, 92, 90, 0.25), 0 0 0 1px rgba(255,255,255,0.6) inset",
        }}
      >
        {/* Header */}
        <div className="pt-6 px-6 pb-3 flex items-start justify-between flex-shrink-0">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0f3a39] leading-none">
              Markito
            </h1>
            <span className="text-[12px] font-medium" style={{ color: "#00ACA9" }}>
              Assistente de Marketing Digital
            </span>
          </div>
          <div className="flex items-center gap-2">
            {phase === "chat" && (
              <button
                data-testid="btn-reset"
                onClick={handleReset}
                className="p-2 rounded-full transition-colors text-[#00ACA9] hover:bg-[#00ACA915]"
                title="Nova conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <span className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-2.5 py-1 shadow-sm">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-semibold text-gray-600">Online</span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {phase === "welcome" ? (
              /* ========== WELCOME SCREEN ========== */
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-2 space-y-4"
              >
                {/* Mascot greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-3 pt-3"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}markito-avatar.png?v=2`}
                    alt="Markito"
                    className="flex-shrink-0 w-20 h-20 object-contain"
                  />
                  <div
                    className="relative bg-[#f5fbfb] rounded-2xl rounded-tl-sm p-4 text-[14px] leading-relaxed font-medium text-[#1a3a3a] flex-1"
                    style={{ border: "1px solid #00ACA920" }}
                  >
                    Olá! Sou o{" "}
                    <span className="font-bold" style={{ color: "#00ACA9" }}>
                      Markito
                    </span>
                    , assistente de marketing digital da{" "}
                    <span className="font-bold" style={{ color: "#00ACA9" }}>
                      Rede Farmácias Associadas
                    </span>
                    . Estou aqui para ajudar a sua farmácia a fortalecer a presença digital e atrair mais clientes. Como posso ajudar hoje?
                  </div>
                </motion.div>

                {/* Intent cards (horizontal list-style) */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  {intents.map((intent) => (
                    <button
                      key={intent.id}
                      data-testid={`btn-intent-${intent.id}`}
                      onClick={() => { trackSuggestion(intent.label); startChat(intent.userMessage); }}
                      className="group flex items-center gap-3 text-left p-3 rounded-2xl bg-white border border-gray-100 hover:border-[#00ACA9] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                      style={{ boxShadow: "0 1px 3px rgba(0,92,90,0.06)" }}
                    >
                      <div
                        className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
                        style={{ background: "#00ACA915" }}
                      >
                        {intent.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#0f3a39] leading-tight">
                          {intent.label}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-2">
                          {intent.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00ACA9] transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              /* ========== CHAT SCREEN ========== */
              <motion.div
                key="chat"
                ref={chatContainerRef}
                onScroll={handleChatScroll}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#00ACA950 transparent" }}
              >
                {chatMessages.map((msg) =>
                  msg.role === "assistant" && msg.content === "" && msg.isStreaming ? (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-2"
                    >
                      <Mascot size="sm" />
                      <div
                        className="bg-[#f5fbfb] rounded-2xl rounded-bl-sm border border-[#00ACA920] px-4 py-3 flex items-center gap-2"
                        data-testid={`message-${msg.id}`}
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms]"
                            style={{ backgroundColor: "#00ACA9" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms]"
                            style={{ backgroundColor: "#00ACA9" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms]"
                            style={{ backgroundColor: "#00ACA9" }}
                          />
                        </div>
                        <span className="text-xs font-medium text-[#00ACA9]">
                          Digitando...
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <MessageBubble key={msg.id} msg={msg} />
                  )
                )}
                <div ref={bottomRef} className="h-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions – fixed strip, only in welcome phase */}
        {phase === "welcome" && (
          <div className="flex-shrink-0 px-5 pt-3 pb-2">
            <div className="flex items-center gap-1.5 mb-2 ml-0.5">
              <Sparkles className="w-3 h-3" style={{ color: "#00ACA9" }} />
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#00ACA9" }}
              >
                Sugestões rápidas
              </p>
            </div>
            <div className="relative">
              <div
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
                style={{ background: "linear-gradient(to left, #ffffff 30%, transparent)" }}
              />
              <div
                ref={suggestionsRef}
                className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5 cursor-grab select-none"
                onMouseDown={onSuggestionMouseDown}
                onMouseMove={onSuggestionMouseMove}
                onMouseUp={onSuggestionMouseUp}
                onMouseLeave={onSuggestionMouseUp}
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    data-testid={`btn-suggestion-${i}`}
                    onClick={() => { if (!dragState.current.moved) { trackSuggestion(s.text); startChat(s.text); } }}
                    className="whitespace-nowrap flex-none flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white border border-gray-200 hover:border-[#00ACA9] hover:shadow-sm transition-all"
                    style={{ color: "#00786f" }}
                  >
                    {s.icon}
                    <span>{s.text}</span>
                  </button>
                ))}
                <span
                  className="flex-none w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: "#00ACA9" }} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Input footer */}
        <div className="px-4 pt-2 pb-3 flex-shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            >
              <Smile className="w-4 h-4 text-gray-400" />
            </span>
            <input
              ref={inputRef}
              type="text"
              data-testid="input-chat"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta aqui..."
              disabled={isStreaming}
              className="w-full bg-[#f5fbfb] border border-gray-200 rounded-full pl-11 pr-14 py-3.5 text-[#0f3a39] placeholder:text-gray-400 focus:outline-none focus:border-[#00ACA9] focus:ring-2 focus:ring-[#00ACA940] font-medium text-sm transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              data-testid="btn-send"
              disabled={!inputValue.trim() || isStreaming}
              className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-full flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "#00ACA9",
                boxShadow: "0 4px 12px rgba(0, 172, 169, 0.35)",
              }}
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </form>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col items-center gap-1"
      >
        <img
          src={`${import.meta.env.BASE_URL}logo-farmacias.png`}
          alt="Farmácias Associadas"
          className="h-10 object-contain"
          data-testid="img-logo-farmacias"
        />
        <p className="text-center text-[11px] leading-snug text-white/80 mt-1">
          © 2026 Farmácias Associadas. Todos os direitos reservados.
        </p>
        <p className="text-center text-[11px] leading-snug text-white/70">
          Desenvolvido por{" "}
          <a
            href="https://www.linkedin.com/in/bianca-fcampello"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
            data-testid="link-bianca-linkedin"
          >
            Bianca Campello
          </a>
        </p>
        <p className="text-[11px] text-white/80 mt-1">
          <a
            href={`${BASE_URL}/privacidade`}
            className="underline hover:text-white transition-colors"
            data-testid="link-privacy"
          >
            Política de Privacidade
          </a>
        </p>
        <PrivacyProof />
      </motion.div>
    </div>
  );
}

function AdminGuard({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    localStorage.removeItem("markito_admin_token");
    fetch(`${BASE_URL}/api/admin/me`).then((r) => {
      if (!r.ok) { localStorage.removeItem("markito_admin_token"); setLocation("/admin/login"); }
      else setChecking(false);
    }).catch(() => setLocation("/admin/login"));
  }, []);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#00ACA9" }}>
      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => (
          <PrivacyConsentGate>
            <Home />
          </PrivacyConsentGate>
        )}
      </Route>
      <Route path="/privacidade" component={Privacy} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">{() => <AdminGuard component={AdminDashboard} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <React.Suspense fallback={<div role="status" className="p-6 text-center">Carregando…</div>}>
            <Router />
          </React.Suspense>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
