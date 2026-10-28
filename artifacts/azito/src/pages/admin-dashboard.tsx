import { useState, useEffect, useCallback } from "react";
import { AdminPrivacy } from "@/components/admin-privacy";
import { useLocation } from "wouter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MessageSquare,
  Users,
  TrendingUp,
  Calendar,
  LogOut,
  BarChart2,
  List,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  MapPin,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

function authHeaders() {
  return {
    "Content-Type": "application/json",
  };
}

interface Stats {
  totalMessages: number;
  totalConversations: number;
  todayMessages: number;
  weekMessages: number;
  messagesPerDay: { date: string; count: number }[];
  topSuggestions: { text: string; count: number }[];
  wordCloud: { word: string; count: number }[];
}

interface ConversationSummary {
  id: number;
  title: string | null;
  createdAt: string;
  messageCount: number;
  userMessageCount: number;
  firstUserMessage: string | null;
}

interface ConversationsPage {
  total: number;
  page: number;
  pages: number;
  limit: number;
  conversations: ConversationSummary[];
}

interface ConversationMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface AccessLog {
  id: number;
  ipAddress: string | null;
  userAgent: string | null;
  location: string | null;
  accessedAt: string;
}

type Tab = "overview" | "questions" | "history" | "privacy";

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: accent ? `${accent}15` : "#00ACA915" }}
      >
        <span style={{ color: accent || "#00ACA9" }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function WordCloud({ words }: { words: { word: string; count: number }[] }) {
  if (!words.length) {
    return (
      <p className="text-gray-400 text-sm text-center py-8">
        Nenhuma pergunta registrada ainda.
      </p>
    );
  }
  const max = words[0].count;
  const min = words[words.length - 1].count;
  const range = max - min || 1;
  const colors = ["#00ACA9", "#EC6608", "#0891b2", "#059669", "#7c3aed", "#db2777"];

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center py-2">
      {words.map(({ word, count }, i) => {
        const ratio = (count - min) / range;
        const size = Math.round(12 + ratio * 22);
        const color = colors[i % colors.length];
        const opacity = 0.5 + ratio * 0.5;
        return (
          <span
            key={word}
            title={`${word}: ${count}x`}
            className="cursor-default leading-tight"
            style={{ fontSize: `${size}px`, color, opacity, fontWeight: ratio > 0.5 ? 700 : 400 }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [convData, setConvData] = useState<ConversationsPage | null>(null);
  const [convPage, setConvPage] = useState(1);
  const [convFrom, setConvFrom] = useState("");
  const [convTo, setConvTo] = useState("");
  const [convLoading, setConvLoading] = useState(false);
  const [expandedConv, setExpandedConv] = useState<number | null>(null);
  const [convMessages, setConvMessages] = useState<Record<number, ConversationMessage[]>>({});
  const [convMsgLoading, setConvMsgLoading] = useState<number | null>(null);

  const [accessLog, setAccessLog] = useState<AccessLog[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);

  const logout = async () => {
    const response = await fetch(`${BASE_URL}/api/admin/logout`, { method: "POST" });
    if (!response.ok) {
      window.alert("Não foi possível encerrar a sessão. Tente novamente.");
      return;
    }
    localStorage.removeItem("markito_admin_token");
    setLocation("/admin/login");
  };

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/stats`, { headers: authHeaders() });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setStats(data);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchConversations = useCallback(async (page = 1, from = "", to = "") => {
    setConvLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const res = await fetch(`${BASE_URL}/api/admin/conversations-list?${params}`, {
        headers: authHeaders(),
      });
      if (res.status === 401) { logout(); return; }
      setConvData(await res.json());
    } finally {
      setConvLoading(false);
    }
  }, []);

  const fetchConversationMessages = useCallback(async (convId: number) => {
    if (convMessages[convId]) return;
    setConvMsgLoading(convId);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/conversations/${convId}/messages`, {
        headers: authHeaders(),
      });
      if (res.status === 401) { logout(); return; }
      const msgs: ConversationMessage[] = await res.json();
      setConvMessages((prev) => ({ ...prev, [convId]: msgs }));
    } finally {
      setConvMsgLoading(null);
    }
  }, [convMessages]);

  const fetchAccessLog = useCallback(async () => {
    setAccessLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/access-log`, { headers: authHeaders() });
      if (res.status === 401) { logout(); return; }
      setAccessLog(await res.json());
    } finally {
      setAccessLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (tab === "questions" && !convData) fetchConversations(1);
  }, [tab]);

  useEffect(() => {
    if (tab === "history" && !accessLog.length) fetchAccessLog();
  }, [tab]);

  const applyConvFilter = () => {
    setConvPage(1);
    setExpandedConv(null);
    fetchConversations(1, convFrom, convTo);
  };

  const clearConvFilter = () => {
    setConvFrom("");
    setConvTo("");
    setConvPage(1);
    setExpandedConv(null);
    fetchConversations(1, "", "");
  };

  const toggleConversation = (convId: number) => {
    if (expandedConv === convId) {
      setExpandedConv(null);
    } else {
      setExpandedConv(convId);
      fetchConversationMessages(convId);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Visão Geral", icon: <BarChart2 size={16} /> },
    { id: "questions", label: "Perguntas", icon: <List size={16} /> },
    { id: "history", label: "Histórico de Acesso", icon: <Clock size={16} /> },
    { id: "privacy", label: "Dados pessoais", icon: <List size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="sticky top-0 z-10 shadow-sm"
        style={{ background: "#00ACA9" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}logo-farmacias.png`}
              alt="Farmácias Associadas"
              className="h-7 object-contain brightness-0 invert opacity-90"
            />
            <span className="text-white font-bold text-sm tracking-wide hidden sm:block">
              Painel Admin · Markito
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? "text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={tab === t.id ? { background: "#00ACA9" } : {}}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "privacy" && <AdminPrivacy onDeleted={() => {
          setConvMessages({}); setExpandedConv(null);
          void fetchStats(); void fetchConversations(convPage, convFrom, convTo);
        }} />}
        {/* ======== OVERVIEW TAB ======== */}
        {tab === "overview" && (
          <div className="space-y-6">
            {statsLoading ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <RefreshCw size={20} className="animate-spin mr-2" /> Carregando...
              </div>
            ) : stats ? (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <KpiCard
                    icon={<MessageSquare size={22} />}
                    label="Total de Perguntas"
                    value={stats.totalMessages.toLocaleString("pt-BR")}
                    sub="desde o início"
                  />
                  <KpiCard
                    icon={<Users size={22} />}
                    label="Conversas"
                    value={stats.totalConversations.toLocaleString("pt-BR")}
                    sub="sessões iniciadas"
                  />
                  <KpiCard
                    icon={<TrendingUp size={22} />}
                    label="Hoje"
                    value={stats.todayMessages.toLocaleString("pt-BR")}
                    sub="perguntas hoje"
                    accent="#EC6608"
                  />
                  <KpiCard
                    icon={<Calendar size={22} />}
                    label="Esta Semana"
                    value={stats.weekMessages.toLocaleString("pt-BR")}
                    sub="últimos 7 dias"
                    accent="#7c3aed"
                  />
                </div>

                {/* Chart + Top Suggestion */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Activity chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-800 text-sm">
                        Atividade nos Últimos 30 Dias
                      </h2>
                      <span className="text-xs text-gray-400">perguntas/dia</span>
                    </div>
                    {stats.messagesPerDay.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={stats.messagesPerDay}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(v) => formatShortDate(v)}
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            tickLine={false}
                            axisLine={false}
                            width={28}
                          />
                          <Tooltip
                            formatter={(v: any) => [`${v} pergunta(s)`, ""]}
                            labelFormatter={(l) => formatShortDate(l)}
                            contentStyle={{
                              borderRadius: 12,
                              border: "1px solid #e5e7eb",
                              fontSize: 12,
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#00ACA9"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5, fill: "#00ACA9" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-44 flex items-center justify-center text-gray-400 text-sm">
                        Nenhuma atividade nos últimos 30 dias.
                      </div>
                    )}
                  </div>

                  {/* Top suggestions */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <Star size={16} style={{ color: "#EC6608" }} />
                      <h2 className="font-bold text-gray-800 text-sm">
                        Sugestões Mais Clicadas
                      </h2>
                    </div>
                    {stats.topSuggestions.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topSuggestions.map((s, i) => (
                          <div key={s.text} className="flex items-center gap-3">
                            <span
                              className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                              style={{
                                background: i === 0 ? "#EC6608" : "#00ACA920",
                                color: i === 0 ? "white" : "#00ACA9",
                              }}
                            >
                              {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700 font-medium leading-tight truncate">
                                {s.text}
                              </p>
                              <p className="text-xs text-gray-400">{s.count}x clicado</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-6">
                        Nenhum clique registrado ainda.
                      </p>
                    )}
                  </div>
                </div>

                {/* Word Cloud */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-800 text-sm">
                      Nuvem de Palavras — Termos Mais Frequentes
                    </h2>
                    <button
                      onClick={fetchStats}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Atualizar
                    </button>
                  </div>
                  <WordCloud words={stats.wordCloud} />
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-16">
                Erro ao carregar dados. Tente novamente.
              </div>
            )}
          </div>
        )}

        {/* ======== QUESTIONS TAB ======== */}
        {tab === "questions" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">De</label>
                <input
                  type="date"
                  value={convFrom}
                  onChange={(e) => setConvFrom(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACA9]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Até</label>
                <input
                  type="date"
                  value={convTo}
                  onChange={(e) => setConvTo(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACA9]/30"
                />
              </div>
              <button
                onClick={applyConvFilter}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                style={{ background: "#00ACA9" }}
              >
                <Search size={14} /> Filtrar
              </button>
              {(convFrom || convTo) && (
                <button
                  onClick={clearConvFilter}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Limpar
                </button>
              )}
              {convData && (
                <span className="ml-auto text-xs text-gray-400">
                  {convData.total.toLocaleString("pt-BR")} conversa(s) encontrada(s)
                </span>
              )}
            </div>

            {/* Conversations list */}
            <div className="space-y-3">
              {convLoading ? (
                <div className="flex items-center justify-center h-48 text-gray-400 bg-white rounded-2xl border border-gray-100">
                  <RefreshCw size={20} className="animate-spin mr-2" /> Carregando...
                </div>
              ) : convData && convData.conversations.length > 0 ? (
                <>
                  {convData.conversations.map((conv) => {
                    const isExpanded = expandedConv === conv.id;
                    const msgs = convMessages[conv.id];
                    const isLoadingMsgs = convMsgLoading === conv.id;

                    return (
                      <div
                        key={conv.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        {/* Conversation header — click to expand */}
                        <button
                          onClick={() => toggleConversation(conv.id)}
                          className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "#00ACA915" }}
                          >
                            <MessageSquare size={16} style={{ color: "#00ACA9" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 font-medium truncate">
                              {conv.firstUserMessage || conv.title || `Conversa #${conv.id}`}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {formatDate(conv.createdAt)} ·{" "}
                              <span className="font-medium" style={{ color: "#00ACA9" }}>
                                {conv.userMessageCount} pergunta{conv.userMessageCount !== 1 ? "s" : ""}
                              </span>
                              {" "}· {conv.messageCount} mensagens no total
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-gray-400">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </button>

                        {/* Conversation thread */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
                            {isLoadingMsgs ? (
                              <div className="flex items-center justify-center h-24 text-gray-400">
                                <RefreshCw size={16} className="animate-spin mr-2" /> Carregando conversa...
                              </div>
                            ) : msgs && msgs.length > 0 ? (
                              <div className="space-y-3">
                                {msgs.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                  >
                                    {/* Avatar */}
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                        msg.role === "user"
                                          ? "bg-[#EC6608] text-white"
                                          : "bg-[#00ACA9] text-white"
                                      }`}
                                    >
                                      {msg.role === "user" ? (
                                        <User size={13} />
                                      ) : (
                                        <Bot size={13} />
                                      )}
                                    </div>

                                    {/* Bubble */}
                                    <div
                                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
                                        msg.role === "user"
                                          ? "rounded-tr-sm text-white"
                                          : "rounded-tl-sm bg-white border border-gray-200 text-gray-700"
                                      }`}
                                      style={
                                        msg.role === "user"
                                          ? { background: "#EC6608" }
                                          : {}
                                      }
                                    >
                                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                        {msg.content}
                                      </p>
                                      <p
                                        className={`text-[10px] mt-1 ${
                                          msg.role === "user"
                                            ? "text-white/70 text-right"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {formatDate(msg.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 text-center py-4">
                                Nenhuma mensagem encontrada.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {convData.pages > 1 && (
                    <div className="flex items-center justify-between px-2 py-1">
                      <button
                        disabled={convPage <= 1}
                        onClick={() => {
                          const p = convPage - 1;
                          setConvPage(p);
                          setExpandedConv(null);
                          fetchConversations(p, convFrom, convTo);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white border border-gray-200 shadow-sm"
                      >
                        <ChevronLeft size={14} /> Anterior
                      </button>
                      <span className="text-xs text-gray-400">
                        Página {convPage} de {convData.pages}
                      </span>
                      <button
                        disabled={convPage >= convData.pages}
                        onClick={() => {
                          const p = convPage + 1;
                          setConvPage(p);
                          setExpandedConv(null);
                          fetchConversations(p, convFrom, convTo);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white border border-gray-200 shadow-sm"
                      >
                        Próxima <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 bg-white rounded-2xl border border-gray-100 gap-2">
                  <MessageSquare size={32} strokeWidth={1.5} />
                  <p className="text-sm">Nenhuma conversa encontrada.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======== HISTORY TAB ======== */}
        {tab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Últimos 100 acessos ao painel administrativo
              </p>
              <button
                onClick={fetchAccessLog}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RefreshCw size={12} /> Atualizar
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {accessLoading ? (
                <div className="flex items-center justify-center h-48 text-gray-400">
                  <RefreshCw size={20} className="animate-spin mr-2" /> Carregando...
                </div>
              ) : accessLog.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {accessLog.map((log, i) => (
                    <div key={log.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{ background: "#00ACA915", color: "#00ACA9" }}
                          >
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-700">Login realizado</p>
                            {log.location && (
                              <p className="text-xs font-medium flex items-center gap-1 mt-0.5" style={{ color: "#00ACA9" }}>
                                <MapPin size={11} />
                                {log.location}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                              {log.userAgent || "Agente desconhecido"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-600 font-medium">
                            {formatDate(log.accessedAt)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {log.ipAddress || "IP desconhecido"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                  <Clock size={32} strokeWidth={1.5} />
                  <p className="text-sm">Nenhum acesso registrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
