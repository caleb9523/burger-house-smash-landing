import { createFileRoute } from "@tanstack/react-router";
import {
  Flame,
  Leaf,
  Star,
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";
import heroBurger from "@/assets/hero-burger.jpg";
import storySmash from "@/assets/story-smash.jpg";
import burgerClassic from "@/assets/burger-classic.jpg";
import burgerPepper from "@/assets/burger-pepper.jpg";
import burgerTruffle from "@/assets/burger-truffle.jpg";
import burgerMonster from "@/assets/burger-monster.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const WHATSAPP_URL = "https://wa.me/5516994611222";

const differentials = [
  {
    icon: Flame,
    title: "Blend Perfeito",
    text: "Carne 100% natural preparada para entregar máxima suculência, sabor intenso e a clássica crosta dourada do verdadeiro smash burger.",
  },
  {
    icon: Leaf,
    title: "Ingredientes Sempre Frescos",
    text: "Pão macio, vegetais selecionados, queijos premium e molhos preparados para realçar cada ingrediente sem esconder seu sabor.",
  },
  {
    icon: Star,
    title: "Padrão Burger House",
    text: "Cada pedido é preparado na hora, garantindo qualidade, temperatura ideal e uma experiência digna dos apaixonados por hambúrguer.",
  },
];

const menu = [
  {
    name: "House Classic Smash",
    desc: "Dois discos de carne 100% natural, queijo cheddar derretido, cebola caramelizada e molho especial da casa no pão brioche amanteigado.",
    price: "R$ 34,90",
    img: burgerClassic,
    tag: "Mais Pedido",
  },
  {
    name: "Black Pepper Deluxe",
    desc: "Smash burger duplo, queijo prato premium, bacon crocante, cebola crispy e um irresistível molho de pimenta preta com toque amanteigado.",
    price: "R$ 39,90",
    img: burgerPepper,
    tag: "Picante",
  },
  {
    name: "Truffle Prime",
    desc: "Blend premium prensado na chapa, queijo suíço, maionese trufada, rúcula fresca e cebola roxa no brioche artesanal.",
    price: "R$ 46,90",
    img: burgerTruffle,
    tag: "Assinatura",
  },
  {
    name: "Double House Monster",
    desc: "Quatro smash burgers, cheddar em dobro, bacon extra, picles artesanais e o exclusivo molho Burger House para quem não abre mão de uma experiência intensa.",
    price: "R$ 58,90",
    img: burgerMonster,
    tag: "Monster",
  },
];

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2 group">
      <span className="grid place-items-center w-10 h-10 rounded-full bg-primary btn-primary-glow">
        <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
      </span>
      <span className="font-display text-2xl tracking-widest text-foreground">
        BURGER<span className="text-primary">HOUSE</span>
      </span>
    </a>
  );
}

function Index() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-muted-foreground">
            <a href="#historia" className="hover:text-foreground transition-colors">Nossa História</a>
            <a href="#diferenciais" className="hover:text-foreground transition-colors">Diferenciais</a>
            <a href="#cardapio" className="hover:text-foreground transition-colors">Cardápio</a>
          </nav>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 md:px-6 py-2.5 text-sm font-semibold text-primary-foreground btn-primary-glow hover:brightness-110 hover:scale-[1.03] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Pedir Agora</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center pt-24 pb-16">
        <img
          src={heroBurger}
          alt="Smash burger premium com queijo derretendo"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover object-right opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div className="absolute inset-0 bg-noise pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5 md:px-8 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Smash Burger Premium
            </span>
            <h1 className="mt-6 font-display text-5xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight">
              O <span className="text-gradient-fire">Smash Burger</span>
              <br />que Redefine
              <br />o Sabor.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Carnes 100% naturais, ingredientes selecionados e o verdadeiro smash
              burger premium. Crosta caramelizada, queijo derretendo e um sabor que faz
              você querer a próxima mordida antes mesmo da primeira terminar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground btn-primary-glow hover:brightness-110 hover:scale-[1.02] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Pedir Meu Smash Agora
              </a>
              <a
                href="#cardapio"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-7 py-4 text-base font-semibold text-foreground hover:bg-card transition-all"
              >
                Ver Cardápio
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "100%", v: "Carne Natural" },
                { k: "4.9★", v: "Avaliação" },
                { k: "10k+", v: "Pedidos" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-3xl text-gradient-fire">{s.k}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* História */}
      <section id="historia" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)]">
              <img
                src={storySmash}
                alt="Chef prensando smash burger na chapa"
                width={1400}
                height={1000}
                loading="lazy"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent" />
            </div>
            <div className="hidden sm:block absolute -bottom-8 -right-4 rounded-2xl bg-card border border-border p-6 max-w-[220px] shadow-[var(--shadow-elevated)]">
              <Flame className="w-6 h-6 text-primary" />
              <p className="mt-3 font-display text-xl leading-tight">Prensado na hora, sempre.</p>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">— Desde o primeiro smash</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl leading-tight">
              Nossa <span className="text-gradient-fire">História</span>
            </h2>
            <div className="mt-6 space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Na Burger House, acreditamos que um hambúrguer inesquecível nasce da
                simplicidade feita com perfeição. Tudo começou com uma missão: criar o
                smash burger que nós mesmos sempre procuramos.
              </p>
              <p>
                Escolhemos carnes 100% naturais, ingredientes frescos e uma preparação
                cuidadosa que transforma cada chapa quente em um espetáculo de sabor.
                Cada hambúrguer é prensado na hora para criar a crosta perfeita,
                mantendo a suculência por dentro e entregando uma experiência que
                conquista desde a primeira mordida.
              </p>
              <p className="text-foreground font-medium">
                Mais do que vender hambúrgueres, queremos criar momentos que fazem você
                voltar sempre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="relative py-24 md:py-32 bg-card/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">— Por que Burger House</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl">
              Nossos <span className="text-gradient-fire">Diferenciais</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Três pilares que transformam cada mordida em uma experiência premium.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-5 md:gap-6">
            {differentials.map((d) => (
              <div
                key={d.title}
                className="group relative rounded-2xl border border-border bg-card p-8 hover:border-primary/60 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center group-hover:bg-primary group-hover:border-primary transition-colors">
                  <d.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="mt-6 font-display text-2xl tracking-wide">{d.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{d.text}</p>
                <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cardápio */}
      <section id="cardapio" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">— O melhor da casa</span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl">
                Destaques do <span className="text-gradient-fire">Cardápio</span>
              </h2>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-foreground transition-colors"
            >
              Peça pelo WhatsApp <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {menu.map((item) => (
              <article
                key={item.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/60 transition-all hover:shadow-[var(--shadow-glow)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    width={900}
                    height={900}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-primary-foreground">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl md:text-3xl tracking-wide">{item.name}</h3>
                    <span className="shrink-0 font-display text-2xl text-gradient-fire">{item.price}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Pedir este
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-blood to-background" />
        <div className="absolute inset-0 bg-noise opacity-70" />
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-ember/40 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-5 md:px-8 text-center">
          <Flame className="w-12 h-12 mx-auto text-primary-foreground/90" />
          <h2 className="mt-6 font-display text-4xl sm:text-6xl md:text-7xl leading-[0.95] text-primary-foreground">
            Seu Próximo Hambúrguer
            <br />Favorito Está Esperando.
          </h2>
          <p className="mt-6 text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Não aceite menos do que um verdadeiro smash burger premium. Faça seu pedido
            agora e descubra por que cada detalhe da Burger House foi pensado para
            transformar uma simples refeição em uma experiência inesquecível.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-background px-8 md:px-10 py-5 text-base md:text-lg font-bold text-foreground shadow-[var(--shadow-elevated)] hover:scale-[1.03] transition-all"
          >
            <MessageCircle className="w-6 h-6 text-primary" />
            Pedir pelo WhatsApp — (16) 99461-1222
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Burger House. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            {[
              { icon: Instagram, label: "Instagram", href: "#" },
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: Phone, label: "Telefone", href: WHATSAPP_URL },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 grid place-items-center rounded-full border border-border text-muted-foreground hover:text-primary-foreground hover:bg-primary hover:border-primary transition-colors"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir pelo WhatsApp"
        className="fixed bottom-5 right-5 z-50 group"
      >
        <span className="absolute inset-0 rounded-full bg-primary/60 animate-ping" />
        <span className="relative flex items-center gap-2 rounded-full bg-primary px-5 py-4 text-primary-foreground font-semibold btn-primary-glow hover:brightness-110 hover:scale-105 transition-all">
          <MessageCircle className="w-6 h-6" />
          <span className="hidden sm:inline text-sm">Pedir Agora</span>
        </span>
      </a>
    </div>
  );
}
