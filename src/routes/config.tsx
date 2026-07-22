import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { store, useStore } from "@/lib/painel-store";

export const Route = createFileRoute("/config")({
  component: ConfigView,
  head: () => ({
    meta: [
      { title: "Configuração | Painel de Gestão" },
      {
        name: "description",
        content: "Dados da empresa exibidos no rótulo e no cabeçalho do painel.",
      },
      { property: "og:title", content: "Configuração | Painel de Gestão" },
      { property: "og:description", content: "Configure os dados da empresa-cliente." },
    ],
  }),
});

function ConfigView() {
  const config = useStore((s) => s.config);
  const [form, setForm] = useState(config);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => setForm(config), [config]);

  const salvar = () => {
    store.updateConfig(form);
    setMsg("Configuração salva.");
  };

  const F = (label: string, key: keyof typeof form) => (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={form[key] ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Configuração da empresa</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estes dados aparecem no rodapé dos rótulos e identificam a instalação do painel.
      </p>

      <div className="mt-6 max-w-lg rounded-xl border border-border bg-card p-5 space-y-3">
        {F("Nome da empresa", "nomeEmpresa")}
        {F("CNPJ", "cnpj")}
        {F("Endereço", "endereco")}
        {F("Telefone", "telefone")}

        <button
          onClick={salvar}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Salvar
        </button>

        {msg && <p className="text-sm text-[color:var(--success)]">{msg}</p>}
      </div>
    </div>
  );
}
