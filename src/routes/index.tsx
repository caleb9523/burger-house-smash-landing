import { createFileRoute } from "@tanstack/react-router";
import { Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";
import { useStore, valorEmEstoque } from "@/lib/painel-store";
import { brl, dt } from "@/lib/format";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard | Painel de Gestão" },
      {
        name: "description",
        content:
          "Visão geral do negócio: produtos cadastrados, valor em estoque, faturamento e alertas de estoque mínimo.",
      },
      { property: "og:title", content: "Dashboard | Painel de Gestão" },
      {
        property: "og:description",
        content: "Indicadores em tempo real do seu painel de gestão.",
      },
    ],
  }),
});

function Card({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "primary" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-[color:var(--success)]",
    warning: "text-[color:var(--warning)]",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          {label}
        </span>
        <Icon className={`w-4 h-4 ${tones[tone]}`} />
      </div>
      <div className={`mt-3 text-3xl font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}

function Dashboard() {
  const produtos = useStore((s) => s.produtos);
  const vendas = useStore((s) => s.vendas);

  const totalProdutos = produtos.length;
  const totalEmEstoque = produtos.reduce((s, p) => s + valorEmEstoque(p), 0);
  const abaixoMinimo = produtos.filter((p) => p.estoqueAtual < p.estoqueMinimo).length;

  const hoje = new Date();
  const mesRef = `${hoje.getFullYear()}-${hoje.getMonth()}`;
  const faturamentoMes = vendas
    .filter((v) => {
      const d = new Date(v.data);
      return `${d.getFullYear()}-${d.getMonth()}` === mesRef;
    })
    .reduce((s, v) => s + v.total, 0);

  const ultimasVendas = [...vendas].sort((a, b) => (a.data < b.data ? 1 : -1)).slice(0, 5);
  const criticos = produtos.filter((p) => p.estoqueAtual < p.estoqueMinimo).slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Visão geral calculada a partir dos dados reais do seu painel.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Produtos cadastrados" value={String(totalProdutos)} icon={Package} />
        <Card
          label="Valor total em estoque"
          value={brl(totalEmEstoque)}
          icon={DollarSign}
          tone="primary"
        />
        <Card
          label="Abaixo do estoque mínimo"
          value={String(abaixoMinimo)}
          icon={AlertTriangle}
          tone={abaixoMinimo > 0 ? "warning" : "default"}
        />
        <Card
          label="Faturamento do mês"
          value={brl(faturamentoMes)}
          icon={TrendingUp}
          tone="success"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Últimas vendas
          </h2>
          {ultimasVendas.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nenhuma venda registrada ainda.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {ultimasVendas.map((v) => (
                <li key={v.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{v.cliente || "Cliente não informado"}</div>
                    <div className="text-xs text-muted-foreground">{dt(v.data)}</div>
                  </div>
                  <div className="font-semibold text-primary">{brl(v.total)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Estoque crítico
          </h2>
          {criticos.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Nenhum produto abaixo do estoque mínimo.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {criticos.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{p.nome}</div>
                    <div className="text-xs text-muted-foreground">
                      Mínimo: {p.estoqueMinimo} {p.unidadeMedida}
                    </div>
                  </div>
                  <div className="font-semibold text-[color:var(--warning)]">
                    {p.estoqueAtual} {p.unidadeMedida}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
