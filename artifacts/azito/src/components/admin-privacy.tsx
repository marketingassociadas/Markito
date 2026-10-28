import { useEffect, useState } from "react";
import type { PrivacyActionInput } from "@workspace/api-client-react";

const base = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api/admin/privacy`;
type Audit = { id: string; actor: string; action: string; conversation_id: number | null; verification: string; reference: string; created_at: string };
type Overview = {
  policy: { conversationDays: number; auditDays: number };
  expired: { id: number; last_activity: string }[];
  audit: Audit[];
  expiredAuditCount: number;
};
const field = "block w-full border rounded-lg p-2 mt-1 bg-white";
const button = "rounded-lg px-4 py-2 bg-[#008e8b] text-white disabled:opacity-50";
export function AdminPrivacy({ onDeleted }: { onDeleted: () => void }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [id, setId] = useState("");
  const [action, setAction] = useState<PrivacyActionInput["action"]>("access");
  const [verification, setVerification] = useState<PrivacyActionInput["verification"]>("session");
  const [reference, setReference] = useState("");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [purgeConfirmation, setPurgeConfirmation] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const expected = `${action === "delete" ? "EXCLUIR" : action === "export" ? "EXPORTAR" : "ACESSAR"} ${id}`;
  async function request(path: string, body?: unknown) {
    const res = await fetch(base + path, body ? {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    } : undefined);
    const data = await res.json();
    if (res.status === 401) {
      setOverview(null); setResult(""); setCode(""); setVerified(false); setConfirmation("");
    }
    if (!res.ok) throw new Error(res.status === 401 ? "Sessão encerrada. Entre novamente no painel." : data.error || "Falha na operação.");
    return data;
  }
  async function refresh() { setOverview(await request("")); }
  useEffect(() => {
    const load = () => { refresh().catch(err => setError(err.message)); };
    load();
    const timer = window.setInterval(load, 60000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => { setResult(""); setConfirmation(""); setVerified(false); }, [id, action, verification]);
  async function execute() {
    setBusy(true); setError(""); setResult("");
    try {
      const body: PrivacyActionInput = { conversationId: Number(id), action, verification, reference, code, independentVerified: verified, confirmation };
      const data = await request("/action", body);
      setCode(""); setConfirmation(""); setVerified(false);
      if (action === "export") {
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = url; link.download = `markito-conversa-${id}.json`; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setResult("Exportação gerada. Entregue o arquivo somente pelo canal verificado e remova cópias locais após a entrega.");
      } else if (action === "delete") {
        setResult(`Conversa ${id} e mensagens excluídas. O registro mínimo de auditoria foi preservado.`);
        onDeleted();
      } else setResult(JSON.stringify(data, null, 2));
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Falha de conexão."); }
    finally { setBusy(false); }
  }
  async function purge() {
    setBusy(true); setError(""); setResult("");
    try {
      const data = await request("/purge-audit", { confirmation: purgeConfirmation });
      setResult(`${data.removed} registros de auditoria vencidos removidos.`);
      setPurgeConfirmation(""); await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Falha de conexão."); }
    finally { setBusy(false); }
  }
  return <section className="bg-white border rounded-2xl p-5 space-y-5 text-sm">
    <h2 className="text-xl font-bold">Dados pessoais · LGPD</h2>
    <p>Conversas: <strong>90 dias após a última mensagem</strong> (ou criação, se vazias). Auditoria: <strong>365 dias</strong>. Exclusão somente manual, sem limpeza automática. Revise os vencimentos diariamente.</p>
    <p>O código comprova a sessão do navegador. Sem sessão, exija comprovação independente no canal institucional: valide o solicitante em cadastro institucional confiável e a ligação específica com a conversa. Documente as evidências em registro restrito, referenciado pelo protocolo abaixo. Um ID, IP, nome ou trecho de mensagem isolado não basta. Na dúvida, não prossiga. Nunca atribua conversas antigas a uma nova sessão.</p>
    <fieldset disabled={busy} className="grid sm:grid-cols-2 gap-4">
      <label>ID da conversa<input type="number" min="1" max="2147483647" value={id} onChange={e => setId(e.target.value)} className={field} /></label>
      <label>Operação<select value={action} onChange={e => setAction(e.target.value as typeof action)} className={field}><option value="access">Acessar</option><option value="export">Exportar JSON</option><option value="delete">Excluir definitivamente</option></select></label>
      <label>Verificação<select value={verification} onChange={e => setVerification(e.target.value as typeof verification)} className={field}><option value="session">Código da sessão</option><option value="independent">Comprovação independente documentada</option><option value="retention">Retenção vencida — somente exclusão</option></select></label>
      <label>Protocolo do pedido ou revisão<input value={reference} maxLength={120} onChange={e => setReference(e.target.value)} className={field} placeholder="LGPD-2026-001 (sem dados pessoais)" /></label>
      {verification === "session" && <label>Código de uso único<input autoComplete="off" value={code} maxLength={64} onChange={e => setCode(e.target.value)} className={field} /></label>}
      {verification === "independent" && <label className="flex gap-2 items-start"><input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} />Confirmo que verifiquei a identidade e o vínculo específico com esta conversa por evidências independentes, documentadas no protocolo, não apenas pelo ID.</label>}
      <label>Digite {expected || "a confirmação"}<input autoComplete="off" value={confirmation} onChange={e => setConfirmation(e.target.value)} className={field} /></label>
    </fieldset>
    {action === "delete" && <p className="text-red-700">Exclusão irreversível da base ativa: remove a conversa, mensagens e vínculo de sessão. Não apaga cópias já exportadas, backups nem dados mantidos por fornecedores; trate esses casos conforme o procedimento operacional.</p>}
    <button className={button} disabled={busy || !id || confirmation !== expected || !/^[A-Za-z0-9._/-]{5,120}$/.test(reference) || (verification === "session" && !code) || (verification === "independent" && !verified) || (verification === "retention" && action !== "delete")} onClick={execute}>{busy ? "Processando…" : "Confirmar operação"}</button>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {result && <pre role="status" className="whitespace-pre-wrap break-words bg-gray-50 rounded-lg p-3 max-h-96 overflow-auto">{result}</pre>}
    <h3 className="font-bold">Conversas com retenção vencida</h3>
    {!overview ? <p>Carregando…</p> : <><p>Até 100 mais antigas. Após excluir, a lista é atualizada.</p>
      {overview.expired.length === 0 && <p>Nenhuma conversa vencida.</p>}
      <ul className="max-h-60 overflow-auto space-y-2">{overview.expired.map(row => <li key={row.id} className="flex flex-wrap gap-3 items-center">Conversa {row.id} · última atividade {new Date(row.last_activity).toLocaleString("pt-BR")}<button disabled={busy} className="underline text-[#008e8b]" onClick={() => { setId(String(row.id)); setAction("delete"); setVerification("retention"); }}>Preparar exclusão</button></li>)}</ul>
      <h3 className="font-bold">Auditoria · últimos 100 registros</h3>
      <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr>{["Data", "Administrador", "Operação", "Conversa", "Verificação", "Protocolo"].map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead><tbody>{overview.audit.map(row => <tr key={row.id} className="border-t"><td className="p-2">{new Date(row.created_at).toLocaleString("pt-BR")}</td><td className="p-2">{row.actor}</td><td className="p-2">{row.action}</td><td className="p-2">{row.conversation_id ?? "—"}</td><td className="p-2">{row.verification}</td><td className="p-2">{row.reference}</td></tr>)}</tbody></table></div>
      <p>{overview.expiredAuditCount} registros vencidos há 365 dias. A remoção também gera auditoria.</p>
      <label className="block">Digite EXCLUIR AUDITORIA VENCIDA<input className={field} value={purgeConfirmation} onChange={e => setPurgeConfirmation(e.target.value)} /></label>
      <button className={button} disabled={busy || !overview.expiredAuditCount || purgeConfirmation !== "EXCLUIR AUDITORIA VENCIDA"} onClick={purge}>Excluir somente auditoria vencida</button>
    </>}
  </section>;
}
