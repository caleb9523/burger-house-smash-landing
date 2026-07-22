import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { store, useStore, type ItemVenda } from "@/lib/painel-store";
import { brl, dt } from "@/lib/format";

export const Route = createFileRoute("/vendas")({
  component: VendasView,
  head: () => ({
    meta: [
      { title: "Vendas | Painel de Gestão" },
      {
        name: "description",
        content:
          "Monte um carrinho, calcule o total e finalize a venda — o estoque é baixado automaticamente.",
      },
      { property: "og:title", content: "Vendas | Painel de Gestão" },
      {
        property: "og:description",
        content: "Controle de vendas com baixa automática de estoque.",
      },
    ],
  }),
});

function VendasView() {
  const produtos = useStore((s) => s.produtos);
  const vendas = useStore((s) => s.vendas);

  const [cliente, setCliente] = useState("");
  const [produtoId, setProdutoId] = useState<number | "">("");
  const [quantidade, setQuantidade] = useState("1");
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const adicionar = () => {
    if (produtoId === "") {
      setMsg({ tone: "error", text: "Selecione um produto." });
      return;
    }
    const p = produtos.find((x) => x.id === produtoId)!;
    const q = Number(quantidade);
    if (!Number.isFinite(q) || q <= 0) {
      setMsg({ tone: "error", text: "Quantidade inválida." });
      return;
    }
    setCarrinho((c) => {
      const existe = c.find((i) => i.produtoId === p.id);
      if (existe) {
        return c.map((i) =>
          i.produtoId === p.id ? { ...i, quantidade: i.quantidade + q } : i,
        );
      }
      return [...c, { produtoId: p.id, quantidade: q, precoUnitario: p.precoVenda }];
    });
    setQuantidade("1");
    setMsg(null);
  };

  const removerItem = (pid: number) =>
    setCarrinho((c) => c.filter((i) => i.produtoId !== pid));

  const total = carrinho.reduce((s, i) => s + i.quantidade * i.precoUnitario, 0);

  const finalizar = () => {
    const err = store.registrarVenda(cliente || undefined, carrinho);
    if (err) {
      setMsg({ tone: "error", text: err });
      return;
    }
    setMsg({ tone: "success", text: "Venda registrada." });
    setCarrinho([]);
    setCliente("");
  };

  const lista = [...vendas].sort((a, b) => (a.data < b.data ? 1 : -1));

  return (
    <div>
      <h1 className="text-2xl font-bold">Vendas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Monte a venda no carrinho e finalize — o estoque é baixado automaticamente.
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-5">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border font-semibold text-sm">
            Histórico de vendas
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">Data</th>
                <th className="text-left px-3 py-2.5 font-semibold">Cliente</th>
                <th className="text-right px-3 py-2.5 font-semibold">Itens</th>
                <th className="text-right px-4 py-2.5 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lista.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhuma venda registrada.
                  </td>
                </tr>
              ) : (
                lista.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-2.5">{dt(v.data)}</td>
                    <td className="px-3 py-2.5">{v.cliente || "—"}</td>
                    <td className="px-3 py-2.5 text-right">
                      {v.itens.reduce((s, i) => s + i.quantidade, 0)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-primary">
                      {brl(v.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Nova venda</h2>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Cliente (opcional)</label>
              <input
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-[1fr_90px_auto] gap-2 items-end">
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
                      {p.nome} — {brl(p.precoVenda)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Qtd.</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>
              <button
                onClick={adicionar}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              {carrinho.length === 0 ? (
                <p className="px-3 py-4 text-sm text-center text-muted-foreground">
                  Carrinho vazio.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {carrinho.map((i) => {
                    const p = produtos.find((x) => x.id === i.produtoId);
                    return (
                      <li
                        key={i.produtoId}
                        className="flex items-center justify-between px-3 py-2 text-sm"
                      >
                        <div>
                          <div className="font-medium">{p?.nome}</div>
                          <div className="text-xs text-muted-foreground">
                            {i.quantidade} × {brl(i.precoUnitario)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            {brl(i.quantidade * i.precoUnitario)}
                          </span>
                          <button
                            onClick={() => removerItem(i.produtoId)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{brl(total)}</span>
            </div>

            <button
              onClick={finalizar}
              disabled={carrinho.length === 0}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Finalizar venda
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
