import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { store, useStore } from "@/lib/painel-store";
import { dt } from "@/lib/format";

export const Route = createFileRoute("/estoque")({
  component: EstoqueView,
  head: () => ({
    meta: [
      { title: "Estoque | Painel de Gestão" },
      {
        name: "description",
        content: "Registro de entradas e saídas de estoque com histórico e validação.",
      },
      { property: "og:title", content: "Estoque | Painel de Gestão" },
      {
        property: "og:description",
        content: "Movimentações de estoque com histórico completo.",
      },
    ],
  }),
});

function EstoqueView() {
  const produtos = useStore((s) => s.produtos);
  const movimentos = useStore((s) => s.movimentos);

  const [produtoId, setProdutoId] = useState<number | "">("");
  const [tipo, setTipo] = useState<"Entrada" | "Saida">("Entrada");
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const produtoSel = useMemo(
    () => produtos.find((p) => p.id === produtoId),
    [produtos, produtoId],
  );

  const registrar = () => {
    if (produtoId === "") {
      setMsg({ tone: "error", text: "Selecione um produto." });
      return;
    }
    const q = Number(quantidade);
    if (!Number.isFinite(q) || q <= 0) {
      setMsg({ tone: "error", text: "Informe uma quantidade válida." });
      return;
    }
    const err = store.addMovimento({
      produtoId: Number(produtoId),
      tipo,
      quantidade: q,
      observacao: observacao || undefined,
    });
    if (err) {
      setMsg({ tone: "error", text: err });
      return;
    }
    setMsg({ tone: "success", text: "Movimento registrado." });
    setQuantidade("");
    setObservacao("");
  };

  const lista = [...movimentos].sort((a, b) => (a.data < b.data ? 1 : -1));

  return (
    <div>
      <h1 className="text-2xl font-bold">Estoque</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cada movimento atualiza o estoque atual do produto na hora.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">Data</th>
                <th className="text-left px-3 py-2.5 font-semibold">Produto</th>
                <th className="text-left px-3 py-2.5 font-semibold">Tipo</th>
                <th className="text-right px-3 py-2.5 font-semibold">Qtd.</th>
                <th className="text-left px-4 py-2.5 font-semibold">Observação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Sem movimentações ainda.
                  </td>
                </tr>
              ) : (
                lista.map((m) => {
                  const prod = produtos.find((p) => p.id === m.produtoId);
                  return (
                    <tr key={m.id}>
                      <td className="px-4 py-2.5">{dt(m.data)}</td>
                      <td className="px-3 py-2.5">{prod?.nome ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            m.tipo === "Entrada"
                              ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {m.tipo === "Entrada" ? "Entrada" : "Saída"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium">{m.quantidade}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {m.observacao ?? "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Registrar movimento</h2>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Produto</label>
              <select
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={produtoId}
                onChange={(e) =>
                  setProdutoId(e.target.value === "" ? "" : Number(e.target.value))
                }
              >
                <option value="">— Selecione —</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Estoque atual:{" "}
                {produtoSel
                  ? `${produtoSel.estoqueAtual} ${produtoSel.unidadeMedida}`
                  : "—"}
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Tipo</label>
              <div className="mt-2 flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === "Entrada"}
                    onChange={() => setTipo("Entrada")}
                  />
                  Entrada
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === "Saida"}
                    onChange={() => setTipo("Saida")}
                  />
                  Saída
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Quantidade</label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Observação (opcional)</label>
              <textarea
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            <button
              onClick={registrar}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Registrar movimento
            </button>

            {msg && (
              <p
                className={`text-sm ${
                  msg.tone === "error" ? "text-destructive" : "text-[color:var(--success)]"
                }`}
              >
                {msg.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
