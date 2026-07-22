import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Printer } from "lucide-react";
import { useStore } from "@/lib/painel-store";

export const Route = createFileRoute("/rotulos")({
  component: RotulosView,
  head: () => ({
    meta: [
      { title: "Rótulos | Painel de Gestão" },
      {
        name: "description",
        content:
          "Geração de rótulos de embalagem a partir dos dados do produto: ingredientes, peso, validade e lote.",
      },
      { property: "og:title", content: "Rótulos | Painel de Gestão" },
      {
        property: "og:description",
        content: "Rótulos prontos para impressão a partir do cadastro do produto.",
      },
    ],
  }),
});

function RotulosView() {
  const produtos = useStore((s) => s.produtos);
  const config = useStore((s) => s.config);
  const [produtoId, setProdutoId] = useState<number | "">(produtos[0]?.id ?? "");

  const p = useMemo(
    () => produtos.find((x) => x.id === produtoId),
    [produtos, produtoId],
  );

  const dataFabricacao = new Date();
  const dataValidade = p
    ? new Date(dataFabricacao.getTime() + (p.validadeDias || 0) * 86400000)
    : null;
  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rótulos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rótulo de embalagem gerado a partir do cadastro do produto.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          disabled={!p}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 print:hidden"
        >
          <Printer className="w-4 h-4" /> Imprimir
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5">
        <div className="rounded-xl border border-border bg-card p-5 print:hidden">
          <label className="text-xs text-muted-foreground">Produto</label>
          <select
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">— Selecione —</option>
            {produtos.map((x) => (
              <option key={x.id} value={x.id}>
                {x.nome}
              </option>
            ))}
          </select>

          <p className="mt-4 text-xs text-muted-foreground">
            Os campos exibidos vêm do cadastro do produto (aba Produtos → seção "Dados para o
            rótulo"). Edite lá para atualizar aqui.
          </p>
        </div>

        <div className="flex justify-center">
          {p ? (
            <div className="w-full max-w-[420px] rounded-xl border-2 border-dashed border-border bg-white p-6 text-black shadow-sm print:border-black print:shadow-none">
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-neutral-500">
                  {config.nomeEmpresa}
                </div>
                <div className="mt-1 text-xl font-bold">{p.nome}</div>
                {p.descricao && (
                  <div className="mt-1 text-xs text-neutral-600">{p.descricao}</div>
                )}
              </div>

              <div className="my-4 h-px bg-neutral-300" />

              {p.ingredientes && (
                <div className="text-[11px] leading-snug">
                  <span className="font-bold uppercase">Ingredientes: </span>
                  <span>{p.ingredientes}</span>
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                {p.pesoLiquido && (
                  <div>
                    <div className="uppercase text-neutral-500">Peso líquido</div>
                    <div className="font-semibold">{p.pesoLiquido}</div>
                  </div>
                )}
                {p.numeroLote && (
                  <div>
                    <div className="uppercase text-neutral-500">Lote</div>
                    <div className="font-semibold">{p.numeroLote}</div>
                  </div>
                )}
                <div>
                  <div className="uppercase text-neutral-500">Fabricação</div>
                  <div className="font-semibold">{fmt(dataFabricacao)}</div>
                </div>
                {dataValidade && p.validadeDias > 0 && (
                  <div>
                    <div className="uppercase text-neutral-500">Validade</div>
                    <div className="font-semibold">{fmt(dataValidade)}</div>
                  </div>
                )}
              </div>

              {p.codigoBarras && (
                <div className="mt-4 text-center font-mono text-[11px] tracking-widest">
                  {p.codigoBarras}
                </div>
              )}

              <div className="mt-4 text-[10px] text-center text-neutral-500 space-y-0.5">
                {config.cnpj && <div>CNPJ: {config.cnpj}</div>}
                {config.endereco && <div>{config.endereco}</div>}
                {config.telefone && <div>Contato: {config.telefone}</div>}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[420px] rounded-xl border-2 border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Selecione um produto para visualizar o rótulo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
