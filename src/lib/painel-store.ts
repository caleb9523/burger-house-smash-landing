import { useSyncExternalStore } from "react";

// Modelos espelhando o que está em src/PainelGestao/Models/*.cs
export type Produto = {
  id: number;
  nome: string;
  descricao?: string;
  custoUnitario: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
  unidadeMedida: string;
  codigoBarras?: string;
  ingredientes?: string;
  pesoLiquido?: string;
  validadeDias: number;
  numeroLote?: string;
  dataCadastro: string;
};

export type TipoMovimento = "Entrada" | "Saida";

export type MovimentoEstoque = {
  id: number;
  produtoId: number;
  tipo: TipoMovimento;
  quantidade: number;
  data: string;
  observacao?: string;
};

export type ItemVenda = {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
};

export type Venda = {
  id: number;
  data: string;
  cliente?: string;
  total: number;
  itens: ItemVenda[];
};

export type ConfiguracaoEmpresa = {
  nomeEmpresa: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
};

export type State = {
  produtos: Produto[];
  movimentos: MovimentoEstoque[];
  vendas: Venda[];
  config: ConfiguracaoEmpresa;
};

const STORAGE_KEY = "painel-gestao-v1";

const defaultState: State = {
  produtos: [],
  movimentos: [],
  vendas: [],
  config: { nomeEmpresa: "Minha Empresa" },
};

function load(): State {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

let state: State = defaultState;
let hydrated = false;
const listeners = new Set<() => void>();

function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") {
    state = load();
    hydrated = true;
  }
}

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export const store = {
  get: (): State => {
    ensureHydrated();
    return state;
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  // Produtos
  addProduto: (p: Omit<Produto, "id" | "dataCadastro">) => {
    ensureHydrated();
    const id = Math.max(0, ...state.produtos.map((x) => x.id)) + 1;
    state = {
      ...state,
      produtos: [...state.produtos, { ...p, id, dataCadastro: new Date().toISOString() }],
    };
    emit();
    return id;
  },
  updateProduto: (id: number, p: Partial<Produto>) => {
    ensureHydrated();
    state = {
      ...state,
      produtos: state.produtos.map((x) => (x.id === id ? { ...x, ...p } : x)),
    };
    emit();
  },
  removeProduto: (id: number) => {
    ensureHydrated();
    state = { ...state, produtos: state.produtos.filter((x) => x.id !== id) };
    emit();
  },

  // Movimentos
  addMovimento: (m: Omit<MovimentoEstoque, "id" | "data"> & { data?: string }): string | null => {
    ensureHydrated();
    const prod = state.produtos.find((p) => p.id === m.produtoId);
    if (!prod) return "Produto não encontrado.";
    if (m.quantidade <= 0) return "Informe uma quantidade maior que zero.";
    if (m.tipo === "Saida" && m.quantidade > prod.estoqueAtual) {
      return `Estoque insuficiente. Disponível: ${prod.estoqueAtual}.`;
    }
    const id = Math.max(0, ...state.movimentos.map((x) => x.id)) + 1;
    const novoEstoque =
      m.tipo === "Entrada" ? prod.estoqueAtual + m.quantidade : prod.estoqueAtual - m.quantidade;
    state = {
      ...state,
      movimentos: [
        ...state.movimentos,
        { ...m, id, data: m.data ?? new Date().toISOString() },
      ],
      produtos: state.produtos.map((p) =>
        p.id === prod.id ? { ...p, estoqueAtual: novoEstoque } : p,
      ),
    };
    emit();
    return null;
  },

  // Vendas
  registrarVenda: (cliente: string | undefined, itens: ItemVenda[]): string | null => {
    ensureHydrated();
    if (itens.length === 0) return "Adicione ao menos um item à venda.";
    // valida estoque
    for (const it of itens) {
      const p = state.produtos.find((x) => x.id === it.produtoId);
      if (!p) return "Produto inválido no carrinho.";
      if (it.quantidade > p.estoqueAtual) return `Estoque insuficiente para ${p.nome}.`;
    }
    const total = itens.reduce((s, i) => s + i.quantidade * i.precoUnitario, 0);
    const id = Math.max(0, ...state.vendas.map((x) => x.id)) + 1;
    const dataIso = new Date().toISOString();
    const movStart = Math.max(0, ...state.movimentos.map((x) => x.id));
    const novosMov: MovimentoEstoque[] = itens.map((it, idx) => ({
      id: movStart + idx + 1,
      produtoId: it.produtoId,
      tipo: "Saida",
      quantidade: it.quantidade,
      data: dataIso,
      observacao: `Venda #${id}`,
    }));
    state = {
      ...state,
      vendas: [...state.vendas, { id, data: dataIso, cliente, total, itens }],
      movimentos: [...state.movimentos, ...novosMov],
      produtos: state.produtos.map((p) => {
        const it = itens.find((i) => i.produtoId === p.id);
        return it ? { ...p, estoqueAtual: p.estoqueAtual - it.quantidade } : p;
      }),
    };
    emit();
    return null;
  },

  updateConfig: (c: Partial<ConfiguracaoEmpresa>) => {
    ensureHydrated();
    state = { ...state, config: { ...state.config, ...c } };
    emit();
  },
};

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(defaultState),
  );
}

export const margem = (p: Produto) =>
  p.precoVenda > 0 ? Math.round(((p.precoVenda - p.custoUnitario) / p.precoVenda) * 1000) / 10 : 0;
export const valorEmEstoque = (p: Produto) => p.custoUnitario * p.estoqueAtual;
