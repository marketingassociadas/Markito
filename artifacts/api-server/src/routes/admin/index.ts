import { Router } from "express";
import { adminConfigured, requireAdmin, safeEqual, startAdminSession, endAdminSession, rateLimit } from "../../lib/security";
import { db } from "@workspace/db";
import {
  messages,
  conversations,
  suggestionClicks,
  adminAccessLog,
} from "@workspace/db/schema";
import { desc, asc, eq, gte, lte, and, sql } from "drizzle-orm";
import privacyRouter from "./privacy";

const router: Router = Router();
router.use("/privacy", privacyRouter);

router.post("/login", rateLimit("admin-login", 5, 900), rateLimit("admin-login-global", 100, 900, "global"), async (req: any, res: any) => {
  if (!adminConfigured()) return res.status(503).json({ error: "Acesso administrativo indisponível: configure as credenciais seguras." });
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string" || username.length > 200 || password.length > 1024) {
    return res.status(400).json({ error: "Credenciais inválidas" });
  }
  const expectedUsername = process.env.ADMIN_USERNAME!;
  const expectedPassword = process.env.ADMIN_PASSWORD!;

  const validUser = safeEqual(username, expectedUsername);
  const validPassword = safeEqual(password, expectedPassword);
  if (!validUser || !validPassword) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  await startAdminSession(req, res);

  const rawIp = req.ip || null;
  const location = null;

  await db
    .insert(adminAccessLog)
    .values({
      ipAddress: rawIp,
      userAgent: (req.headers["user-agent"] as string) || null,
      location,
    })
    .catch(() => {});

  res.json({ ok: true });
});

router.post("/logout", async (req, res) => {
  await endAdminSession(req, res);
  res.json({ ok: true });
});

router.get("/me", requireAdmin, (_req: any, res: any) => {
  res.json({ username: process.env.ADMIN_USERNAME });
});

router.post("/suggestion-click", rateLimit("suggestion", 30, 60), async (req: any, res: any) => {
  const { suggestion } = req.body ?? {};
  if (typeof suggestion !== "string" || !suggestion.trim() || suggestion.length > 300) {
    return res.status(400).json({ error: "suggestion required" });
  }
  await db
    .insert(suggestionClicks)
    .values({ suggestionText: suggestion })
    .catch(() => {});
  res.json({ ok: true });
});

router.get("/stats", requireAdmin, async (req: any, res: any) => {
  try {
    const [totalMessages] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(eq(messages.role, "user"));

    const [totalConversations] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(conversations);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [todayMessages] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(eq(messages.role, "user"), gte(messages.createdAt, todayStart)));

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const [weekMessages] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(eq(messages.role, "user"), gte(messages.createdAt, weekAgo)));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const messagesPerDay = await db
      .select({
        date: sql<string>`DATE(${messages.createdAt})`.as("date"),
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(messages)
      .where(and(eq(messages.role, "user"), gte(messages.createdAt, thirtyDaysAgo)))
      .groupBy(sql`DATE(${messages.createdAt})`)
      .orderBy(sql`DATE(${messages.createdAt})`);

    const topSuggestions = await db
      .select({
        text: suggestionClicks.suggestionText,
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(suggestionClicks)
      .groupBy(suggestionClicks.suggestionText)
      .orderBy(desc(sql`count(*)`))
      .limit(5);

    const recentMessages = await db
      .select({ content: messages.content })
      .from(messages)
      .where(eq(messages.role, "user"))
      .orderBy(desc(messages.createdAt))
      .limit(500);

    const STOP_WORDS = new Set([
      "de", "a", "o", "que", "e", "do", "da", "em", "um", "para", "é", "com",
      "uma", "os", "no", "se", "na", "por", "mais", "as", "dos", "como", "mas",
      "ao", "ele", "das", "tem", "seu", "sua", "ou", "ser", "quando", "muito",
      "nos", "já", "está", "eu", "também", "só", "pelo", "pela", "até", "isso",
      "ela", "entre", "era", "depois", "sem", "mesmo", "aos", "ter", "seus",
      "quem", "nas", "me", "esse", "eles", "estão", "você", "não", "minha",
      "meu", "este", "esta", "aqui", "então", "agora", "bem", "cada", "onde",
      "ainda", "vez", "todas", "todos", "outros", "outras", "outro", "outra",
      "quero", "tenho", "posso", "pode", "fazer", "bom", "boa", "preciso",
      "gostaria", "qual", "quais", "para", "sobre", "tenho", "minha", "meu",
      "devo", "dá", "vai", "vou", "como", "minha", "nossa", "nosso",
    ]);

    const freq: Record<string, number> = {};
    for (const { content } of recentMessages) {
      const words = content
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
      for (const word of words) {
        freq[word] = (freq[word] || 0) + 1;
      }
    }

    const wordCloud = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([word, count]) => ({ word, count }));

    res.json({
      totalMessages: totalMessages.count,
      totalConversations: totalConversations.count,
      todayMessages: todayMessages.count,
      weekMessages: weekMessages.count,
      messagesPerDay,
      topSuggestions,
      wordCloud,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar estatísticas" });
  }
});

router.get("/conversations-list", requireAdmin, async (req: any, res: any) => {
  try {
    const {
      from,
      to,
      page = "1",
      limit: limitStr = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limitStr, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    if ((from && !Number.isFinite(Date.parse(from))) || (to && !Number.isFinite(Date.parse(to)))) {
      return res.status(400).json({ error: "Data inválida" });
    }
    const conditions: any[] = [];
    if (from) conditions.push(gte(conversations.createdAt, new Date(from)));
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      conditions.push(lte(conversations.createdAt, toDate));
    }
    const where = conditions.length ? and(...conditions) : undefined;

    const [countRows, rows] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(conversations)
        .where(where),
      db
        .select({
          id: conversations.id,
          title: conversations.title,
          createdAt: conversations.createdAt,
          messageCount: sql<number>`count(${messages.id})::int`,
          userMessageCount: sql<number>`count(case when ${messages.role} = 'user' then 1 end)::int`,
          firstUserMessage: sql<string | null>`min(case when ${messages.role} = 'user' then ${messages.content} end)`,
        })
        .from(conversations)
        .leftJoin(messages, eq(messages.conversationId, conversations.id))
        .where(where)
        .groupBy(conversations.id, conversations.title, conversations.createdAt)
        .orderBy(desc(conversations.createdAt))
        .limit(limitNum)
        .offset(offset),
    ]);

    const total = countRows[0].count;

    res.json({
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      conversations: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar conversas" });
  }
});

router.get("/conversations/:id/messages", requireAdmin, async (req: any, res: any) => {
  try {
    const convId = parseInt(req.params.id, 10);
    if (isNaN(convId)) return res.status(400).json({ error: "ID inválido" });

    const rows = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(asc(messages.createdAt));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar mensagens" });
  }
});

router.get("/access-log", requireAdmin, async (_req: any, res: any) => {
  try {
    const logs = await db
      .select()
      .from(adminAccessLog)
      .orderBy(desc(adminAccessLog.accessedAt))
      .limit(100);
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar histórico" });
  }
});

export default router;
