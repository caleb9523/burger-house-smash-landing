import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { store, useStore, margem, type Produto } from "@/lib/painel-store";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/produtos")({
  component: ProdutosView,
  head: () => ({
    meta: [
      { title: "Produtos | Painel de Gestão" },
      {
        name: "description",
        content:
          "Cadastro completo de produtos: custo, preço, estoque, unidade, código de barras e dados de rótulo.",
      },
      { property: "og:title", content: "Produtos | Painel de Gestão" },
      { property: "og:description", content: "Gerencie o catálogo de produtos do seu negócio." },
    ],
  }),
});

type Form = Omit<Produto, "id" | "dataCadastro">;

const emptyForm: Form = {
  nome: "",
  descricao: "",
  custoUnitario: 0,
  precoVenda: 0,
  estoqueAtual: 0,
  estoqueMinimo: 0,
  unidadeMedida: "un",
  codigoBarras: "",
  ingredientes: "",
  pesoLiquido: "",
  validadeDias: 0,
  numeroLote: "",
};

function num(v: string) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function ProdutosView() {
  const produtos = useStore((s) => s.produtos);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [msg, setMsg] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const select = (p: Produto) => {
    setSelectedId(p.id);
    const { id: _id, dataCadastro: _d, ...rest } = p;
    setForm(rest);
    setMsg(null);
  };

  const novo = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setMsg(null);
  };

  const salvar = () => {
    if (!form.nome.trim()) {
      setMsg({ tone: "error", text: "Informe o nome do produto." });
      return;
    }
    if (selectedId == null) {
      store.addProduto(form);
      setMsg({ tone: "success", text: "Produto cadastrado." });
      novo();
    } else {
      store.updateProduto(selectedId, form);
      setMsg({ tone: "success", text: "Produto atualizado." });
    }
  };

  const excluir = () => {
    if (selectedId == null) return;
    if (!confirm("Excluir este produto?")) return;
    store.removeProduto(selectedId);
    novo();
  };

  const F = (label: string, key: keyof Form, type: "text" | "number" | "textarea" = "text") => {
    const value = (form[key] ?? "") as string | number;
    const onChange = (v: string) =>
      setForm((f) => ({ ...f, [key]: type === "number" ? num(v) : v }));
    if (type === "textarea") {
      return (
        <div>
          <label className="text-xs text-muted-foreground">{label}</label>
          <textarea
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[70px]"
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    }
    return (
      <div>
        <label className="text-xs text-muted-foreground">{label}</label>
        <input
          type={type}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre e edite o catálogo do seu negócio.
          </p>
        </div>
        <button
          onClick={novo}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Novo produto
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold">Nome</th>
                <th className="text-right px-3 py-2.5 font-semibold">Custo</th>
                <th className="text-right px-3 py-2.5 font-semibold">Preço</th>
                <th className="text-right px-3 py-2.5 font-semibold">Estoque</th>
                <th className="text-right px-4 py-2.5 font-semibold">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                produtos.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => select(p)}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedId === p.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 font-medium">{p.nome}</td>
                    <td className="px-3 py-2.5 text-right">{brl(p.custoUnitario)}</td>
                    <td className="px-3 py-2.5 text-right">{brl(p.precoVenda)}</td>
                    <td className="px-3 py-2.5 text-right">
                      {p.estoqueAtual} {p.unidadeMedida}
                    </td>
                    <td className="px-4 py-2.5 text-right">{margem(p)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">
            {selectedId == null ? "Novo produto" : "Editar produto"}
          </h2>

          <div className="mt-4 space-y-3">
            {F("Nome", "nome")}
            {F("Descrição", "descricao", "textarea")}
            <div className="grid grid-cols-2 gap-3">
              {F("Custo (R$)", "custoUnitario", "number")}
              {F("Preço de venda (R$)", "precoVenda", "number")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {F("Estoque atual", "estoqueAtual", "number")}
              {F("Estoque mínimo", "estoqueMinimo", "number")}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {F("Unidade (un, kg, L...)", "unidadeMedida")}
              {F("Código de barras", "codigoBarras")}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Dados para o rótulo
              </div>
              <div className="mt-3 space-y-3">
                {F("Ingredientes / composição", "ingredientes", "textarea")}
                <div className="grid grid-cols-2 gap-3">
                  {F("Peso/volume líquido", "pesoLiquido")}
                  {F("Validade (dias)", "validadeDias", "number")}
                </div>
                {F("Número do lote", "numeroLote")}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={salvar}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Save className="w-4 h-4" /> Salvar
              </button>
              <button
                onClick={excluir}
                disabled={selectedId == null}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:brightness-110 disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" /> Excluir
              </button>
            </div>

            {msg && (
              <p
                className={`text-sm ${
                  msg.tone === "error"
                    ? "text-destructive"
                    : "text-[color:var(--success)]"
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
