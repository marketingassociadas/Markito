import { useState } from "react";

export function PrivacyProof() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [expires, setExpires] = useState("");
  async function generate() {
    setBusy(true); setError(""); setCode("");
    try {
      const res = await fetch(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/api/privacy/proof`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível gerar o código.");
      setCode(data.code);
      setExpires(new Date(Date.now() + data.expiresInMinutes * 60000).toLocaleTimeString("pt-BR"));
    } catch (err) { setError(err instanceof Error ? err.message : "Falha de conexão."); }
    finally { setBusy(false); }
  }
  return <details className="text-xs text-white/90 max-w-lg text-center px-4 mt-2">
    <summary className="cursor-pointer underline">Meus dados · pedidos LGPD</summary>
    <p className="my-2">Para solicitar acesso, exportação ou exclusão, contate o responsável pelo Markito no canal institucional já utilizado. Este código comprova apenas as conversas vinculadas a este navegador, não conversas antigas ou de outra sessão.</p>
    <button disabled={busy} onClick={generate} className="border rounded-lg px-3 py-2 disabled:opacity-50">{busy ? "Gerando…" : "Gerar código de verificação"}</button>
    {code && <div className="mt-2"><p>Código de uso único, válido até {expires}. Compartilhe somente com o responsável autorizado. Gere outro para cada operação.</p><code className="block break-all bg-black/20 rounded p-2 mt-2 select-all">{code}</code></div>}
    {error && <p role="alert" className="mt-2">{error}</p>}
  </details>;
}
