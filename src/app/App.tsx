import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, X, ChevronDown, Search, Copy, CheckCheck,
  Menu, XIcon, ArrowRight, RefreshCw, Github, ExternalLink,
  FileText, Terminal, Plus, Minus,
} from "lucide-react";

type Lang = "pt" | "en";

/* ─── helpers ─── */
const SECTION_IDS = ["intro", "licenses", "consequences", "templates", "howto", "references", "faq"];

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY + 90;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, [ids]);
  return active;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.08 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useInView(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(22px)", transition: `opacity .55s ease ${delay}s, transform .55s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function Expand({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function toggleSet(set: Set<string>, key: string): Set<string> {
  const next = new Set(set);
  if (next.has(key)) next.delete(key); else next.add(key);
  return next;
}

/* ─── UI strings ─── */
const UI = {
  pt: {
    nav: ["Intro", "Licenças", "Consequências", "Templates", "Como usar", "Referências", "FAQ"],
    heroEyebrow: "Para quem nunca viu",
    heroTitle: "O que é uma\nlicença de software?",
    heroSub: "Uma regra que diz o que as pessoas podem fazer com o seu código.",
    heroScroll: "Descobrir",
    heroCards: [
      {
        id: "recipe", icon: "📖", label: "Sua receita", sub: "= seu código",
        detail: "Assim como uma receita de cozinha, seu código é sua criação intelectual. A lei o protege automaticamente — você decide quem pode copiá-lo, modificá-lo ou vendê-lo.",
        points: ["Criado por você → protegido automaticamente", "Você controla o que os outros podem fazer", "Sem licença, ninguém pode usar legalmente"],
      },
      {
        id: "rules", icon: "📋", label: "As regras", sub: "= a licença",
        detail: "A licença é o conjunto de regras que acompanha sua receita. 'Pode usar, mas dê crédito.' 'Pode modificar, mas compartilhe.' É o seu contrato com o mundo.",
        points: ["Define o que é permitido e proibido", "Pode ser longa ou ter só 171 palavras (MIT)", "Escolhida por você, de uma vez, para sempre"],
      },
      {
        id: "chefs", icon: "👨‍🍳", label: "Outros chefs", sub: "= os usuários",
        detail: "São devs, empresas e pesquisadores que querem usar seu código. Sem uma licença clara, eles ficam perdidos — e empresas simplesmente não usam código sem licença.",
        points: ["Podem ser contribuidores ou usuários finais", "Empresas exigem licença antes de usar qualquer código", "Com licença clara, a colaboração acontece naturalmente"],
      },
    ],
    introBadge: "Fundamentos",
    introHeading: "Tudo que você precisa saber",
    introSub: "Antes de escolher uma licença, entenda o contexto.",
    pillars: [
      {
        id: "what", icon: "📜", color: "bg-purple-50 border-purple-100",
        q: "O que é?",
        a: "Um contrato legal entre você e quem usa seu código.",
        extra: "Quando você cria software, a lei de direito autoral (copyright) protege sua obra automaticamente — sem precisar registrar nada. Uma licença é o documento que você usa para informar ao mundo o que as pessoas podem ou não podem fazer com esse código.",
        points: ["Protege sua obra automaticamente", "Define usos permitidos e proibidos", "Pode ser mais ou menos restritiva", "É exigida por lei em projetos colaborativos"],
      },
      {
        id: "why", icon: "🛡️", color: "bg-blue-50 border-blue-100",
        q: "Por que usar?",
        a: "Sem licença, seu código fica em uma zona cinzenta jurídica.",
        extra: "Sem uma licença explícita, o copyright padrão se aplica: ninguém tem permissão de usar, copiar, modificar ou distribuir seu código — nem mesmo para contribuir. Isso afasta colaboradores e pode criar problemas legais inesperados.",
        points: ["Sem licença = ninguém pode usar legalmente", "Evita mal-entendidos e conflitos", "Atrai contribuidores com segurança", "Empresas exigem licença para usar código externo"],
      },
      {
        id: "ctx", icon: "🌍", color: "bg-green-50 border-green-100",
        q: "Quem precisa?",
        a: "Todo dev que publica código — sem exceção.",
        extra: "Não importa se é um script pequeno no GitHub, uma biblioteca usada por milhares ou um produto comercial. Se você publicou código, você precisa de uma licença. E se você usa código de terceiros, precisa verificar a licença deles.",
        points: ["Devs publicando qualquer projeto", "Empresas usando bibliotecas open source", "Acadêmicos compartilhando pesquisa", "Startups construindo sobre OSS"],
      },
    ],
    reasons: [
      { id: "protect", icon: "🔒", title: "Protege você", desc: "Limita sua responsabilidade legal por bugs e danos.", extra: "A maioria das licenças inclui uma cláusula de isenção de garantia. Isso significa que, se o seu software causar danos, você não pode ser responsabilizado — desde que a licença esteja clara." },
      { id: "collab", icon: "🤝", title: "Permite colaboração", desc: "Deixa claro o que outros podem fazer.", extra: "Projetos sem licença não recebem contribuições de empresas e profissionais sérios. A licença é o contrato social que permite a colaboração segura e em escala." },
      { id: "law", icon: "⚖️", title: "É lei", desc: "Copyright existe automaticamente — a licença é como você o exerce.", extra: "Pela Convenção de Berna (assinada por 179 países), sua obra é protegida assim que criada. A licença é o instrumento legal pelo qual você decide como esse direito funciona na prática." },
    ],
    who: [
      {
        id: "devs", icon: "👩‍💻", label: "Desenvolvedores", sub: "publicando código",
        detail: "Você precisa de uma licença em todo projeto publicado — mesmo que seja pequeno. Sem licença, ninguém pode contribuir legalmente com seu repositório.",
        tip: "A MIT é a escolha mais comum entre devs independentes.",
      },
      {
        id: "companies", icon: "🏢", label: "Empresas", sub: "usando open source",
        detail: "Departamentos jurídicos não aprovam uso de código sem licença. Projetos MIT e Apache 2.0 são os mais aceitos por oferecerem clareza legal.",
        tip: "Empresas como Google e Meta auditam licenças de cada dependência.",
      },
      {
        id: "academics", icon: "🎓", label: "Acadêmicos", sub: "compartilhando pesquisa",
        detail: "Pesquisas precisam ser replicáveis. Licenças abertas como MIT permitem que outros pesquisadores usem e citem seu código, aumentando o impacto da pesquisa.",
        tip: "MIT e Apache são preferidas em publicações científicas.",
      },
      {
        id: "startups", icon: "🚀", label: "Startups", sub: "construindo produtos",
        detail: "Startups constroem sobre open source. É essencial verificar as licenças de cada dependência para evitar surpresas jurídicas — especialmente com código GPL.",
        tip: "Cuidado com dependências GPL em produtos comerciais fechados.",
      },
    ],
    licTitle: "As 3 principais licenças",
    licSub: "Clique para expandir — você pode abrir mais de uma",
    requireLabel: "O que exige?",
    permLabel: "Pode fazer",
    noPermLabel: "Não pode fazer",
    usedBy: "Projetos reais",
    exampleRepo: "Ver repositório",
    exampleLicense: "Ver licença",
    compTitle: "Comparação rápida",
    consTitle: "E se eu quebrar?",
    consSub: "Clique para ver casos reais — você pode abrir mais de um",
    consCase: "Caso real",
    consOutcome: "Resultado",
    tmplTitle: "Templates reais do GitHub",
    tmplSub: "Dados ao vivo da API do GitHub — clique para ver o texto completo",
    tmplSearch: "Buscar licença…",
    tmplLoading: "Carregando…",
    tmplCopy: "Copiar texto",
    tmplCopied: "Copiado!",
    howTitle: "Como adicionar uma licença",
    howSub: "Siga os passos — é mais simples do que parece",
    howSteps: [
      {
        n: "01", icon: "🎯", title: "Escolha a licença",
        desc: "Use o site choosealicense.com para descobrir qual é a certa para você.",
        tip: "Para a maioria dos projetos pessoais, a MIT é a escolha mais simples.",
        action: "Abrir choosealicense.com →",
        actionUrl: "https://choosealicense.com/",
        visual: {
          type: "browser" as const,
          url: "choosealicense.com",
          content: ["🟢 MIT — Quero algo simples e permissivo", "🔵 Apache 2.0 — Quero proteção contra patentes", "🟠 GPLv3 — Quero que o código fique sempre aberto"],
        },
      },
      {
        n: "02", icon: "📄", title: "Crie o arquivo LICENSE",
        desc: "No seu repositório do GitHub, clique em 'Add file' → 'Create new file'. Digite o nome LICENSE.",
        tip: "O GitHub vai sugerir automaticamente templates de licença quando o arquivo se chama LICENSE.",
        visual: {
          type: "github" as const,
          steps: ["Vá para a página do seu repositório", "Clique em 'Add file' → 'Create new file'", "Digite 'LICENSE' no campo do nome", "Clique em 'Choose a license template' (aparece automaticamente)", "Selecione a licença desejada e clique em 'Review and submit'"],
        },
      },
      {
        n: "03", icon: "📖", title: "Mencione no README",
        desc: "Adicione um badge no início do seu README.md para deixar claro a licença do projeto.",
        tip: "Badges são gerados pelo shields.io e aparecem como imagens no GitHub.",
        code: "[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)",
        visual: { type: "badge" as const, preview: "MIT" },
      },
      {
        n: "04", icon: "✅", title: "Pronto!",
        desc: "Seu projeto agora está protegido. Contribuidores e usuários sabem exatamente o que podem fazer.",
        tip: "Opcionalmente, adicione um comentário SPDX no topo dos arquivos de código:",
        code: "// SPDX-License-Identifier: MIT",
        visual: {
          type: "done" as const,
          items: ["LICENSE file criado ✓", "README.md atualizado ✓", "Proteção legal ativa ✓", "Contribuidores bem-vindos ✓"],
        },
      },
    ],
    refTitle: "Referências oficiais",
    refSub: "Fontes primárias — leitura recomendada antes de tomar decisões",
    refs: [
      { title: "MIT License", org: "Open Source Initiative", desc: "Texto legal completo e explicação oficial da licença MIT.", url: "https://opensource.org/license/mit", tag: "MIT", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { title: "Apache License 2.0", org: "Apache Software Foundation", desc: "Documentação completa incluindo termos de patentes.", url: "https://www.apache.org/licenses/LICENSE-2.0", tag: "Apache 2.0", tagColor: "bg-blue-50 text-blue-700 border-blue-200" },
      { title: "GNU GPL v3", org: "Free Software Foundation", desc: "Texto da GPLv3 com explicações sobre copyleft e liberdades.", url: "https://www.gnu.org/licenses/gpl-3.0.html", tag: "GPLv3", tagColor: "bg-orange-50 text-orange-700 border-orange-200" },
      { title: "Creative Commons e Software", org: "Creative Commons FAQ", desc: "Por que as licenças CC não são recomendadas para código.", url: "https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software", tag: "CC FAQ", tagColor: "bg-purple-50 text-purple-700 border-purple-200" },
    ],
    faqTitle: "Dúvidas frequentes",
    faqItems: [
      { q: "Código sem licença = livre para usar?", a: "Não. Sem licença, você retém todos os direitos por lei automaticamente (Convenção de Berna). Ninguém pode usar, modificar ou distribuir sem sua permissão explícita — mesmo que o código esteja público no GitHub." },
      { q: "Posso usar código MIT em app pago?", a: "Sim. A MIT permite uso comercial pleno. Você só precisa incluir o aviso de copyright original em algum lugar do seu produto (geralmente na seção de 'sobre' ou nos créditos)." },
      { q: "Creative Commons serve para código?", a: "Não é recomendado. Falta termos essenciais sobre compilação, código-fonte e patentes. Use MIT (equivale a CC-BY) ou GPL (equivale a CC-BY-SA)." },
      { q: "Posso mudar a licença do projeto depois?", a: "Só se você for o único autor. Com contribuidores externos, precisa da permissão de todos — por isso escolha bem desde o início." },
      { q: "O que é o efeito viral da GPL?", a: "Se você distribuir software que usa código GPL, seu código também se torna GPL. Isso garante que o software permaneça sempre aberto e livre." },
      { q: "MIT vs Apache 2.0 — qual a diferença real?", a: "A Apache 2.0 adiciona proteção expressa de patentes: se alguém usar o software e processar usuários por patentes, perde o direito de usar o código. A MIT não tem esse mecanismo." },
      { q: "O que é tivoização, proibida pela GPLv3?", a: "É usar software GPL em hardware bloqueado que impede o usuário de instalar versões modificadas — como o TiVo fazia com o Linux. A GPLv3 proíbe explicitamente isso." },
      { q: "Posso ter partes do projeto com licenças diferentes?", a: "Sim, com cuidado. É comum ter código principal em GPL e plugins em MIT. Mas certifique-se de que as licenças sejam compatíveis — GPL e Apache 2.0 têm incompatibilidades conhecidas em certos usos." },
      { q: "O que é domínio público (Unlicense / CC0)?", a: "Você abre mão de todos os direitos autorais mundiais. O código pode ser usado por qualquer pessoa, de qualquer forma, sem precisar nem citar seu nome. É irreversível." },
      { q: "Qual licença o GitHub recomenda para projetos novos?", a: "O GitHub recomenda a MIT para a maioria dos projetos por ser simples, amplamente compreendida e compatível com quase todas as outras licenças." },
    ],
    footerNote: "Conteúdo educacional · Não é aconselhamento jurídico",
    footerGithub: "Ver no GitHub",
  },
  en: {
    nav: ["Intro", "Licenses", "Consequences", "Templates", "How to use", "References", "FAQ"],
    heroEyebrow: "For those who've never seen one",
    heroTitle: "What is a\nsoftware license?",
    heroSub: "A rule that tells people what they can do with your code.",
    heroScroll: "Discover",
    heroCards: [
      {
        id: "recipe", icon: "📖", label: "Your recipe", sub: "= your code",
        detail: "Just like a cooking recipe, your code is your intellectual creation. The law protects it automatically — you decide who can copy it, modify it, or sell it.",
        points: ["Created by you → protected automatically", "You control what others can do", "Without a license, nobody can use it legally"],
      },
      {
        id: "rules", icon: "📋", label: "The rules", sub: "= the license",
        detail: "The license is the set of rules that comes with your recipe. 'You can use it, but give credit.' 'You can modify it, but share it.' It's your contract with the world.",
        points: ["Defines what is allowed and prohibited", "Can be long or just 171 words (MIT)", "Chosen by you, once, forever"],
      },
      {
        id: "chefs", icon: "👨‍🍳", label: "Other chefs", sub: "= the users",
        detail: "They are devs, companies, and researchers who want to use your code. Without a clear license, they're lost — and companies simply won't use unlicensed code.",
        points: ["Can be contributors or end users", "Companies require a license before using any code", "With a clear license, collaboration happens naturally"],
      },
    ],
    introBadge: "Fundamentals",
    introHeading: "Everything you need to know",
    introSub: "Before choosing a license, understand the context.",
    pillars: [
      {
        id: "what", icon: "📜", color: "bg-purple-50 border-purple-100",
        q: "What is it?",
        a: "A legal agreement between you and anyone who uses your code.",
        extra: "When you create software, copyright law protects your work automatically — no registration needed. A license is the document you use to tell the world what people can or cannot do with that code.",
        points: ["Protects your work automatically", "Defines allowed and prohibited uses", "Can be more or less restrictive", "Required by law in collaborative projects"],
      },
      {
        id: "why", icon: "🛡️", color: "bg-blue-50 border-blue-100",
        q: "Why use one?",
        a: "Without a license, your code lives in a legal grey zone.",
        extra: "Without an explicit license, default copyright applies: no one has permission to use, copy, modify, or distribute your code — not even to contribute. This drives away collaborators and can create unexpected legal problems.",
        points: ["No license = no one can use it legally", "Avoids misunderstandings and conflicts", "Attracts contributors safely", "Companies require licenses to use external code"],
      },
      {
        id: "ctx", icon: "🌍", color: "bg-green-50 border-green-100",
        q: "Who needs it?",
        a: "Every dev who publishes code — no exceptions.",
        extra: "It doesn't matter if it's a small script on GitHub, a library used by thousands, or a commercial product. If you published code, you need a license. And if you use third-party code, you need to check their license.",
        points: ["Devs publishing any project", "Companies using open source libraries", "Academics sharing research", "Startups building on OSS"],
      },
    ],
    reasons: [
      { id: "protect", icon: "🔒", title: "Protects you", desc: "Limits your legal liability for bugs and damages.", extra: "Most licenses include a warranty disclaimer clause. This means that if your software causes harm, you cannot be held liable — as long as the license is clear." },
      { id: "collab", icon: "🤝", title: "Enables collaboration", desc: "Makes clear what others can do.", extra: "Projects without a license don't receive contributions from companies and serious professionals. The license is the social contract that enables safe, scalable collaboration." },
      { id: "law", icon: "⚖️", title: "It's the law", desc: "Copyright exists automatically — the license is how you exercise it.", extra: "Under the Berne Convention (signed by 179 countries), your work is protected the moment it's created. The license is the legal instrument through which you decide how that right works in practice." },
    ],
    who: [
      {
        id: "devs", icon: "👩‍💻", label: "Developers", sub: "publishing code",
        detail: "You need a license on every published project — even small ones. Without a license, no one can legally contribute to your repository.",
        tip: "MIT is the most common choice among independent devs.",
      },
      {
        id: "companies", icon: "🏢", label: "Companies", sub: "using open source",
        detail: "Legal departments won't approve use of unlicensed code. MIT and Apache 2.0 projects are the most accepted by companies for their legal clarity.",
        tip: "Companies like Google and Meta audit licenses of every dependency.",
      },
      {
        id: "academics", icon: "🎓", label: "Academics", sub: "sharing research",
        detail: "Research needs to be replicable. Open licenses like MIT allow other researchers to use and cite your code, increasing the impact of your research.",
        tip: "MIT and Apache are preferred in scientific publications.",
      },
      {
        id: "startups", icon: "🚀", label: "Startups", sub: "building products",
        detail: "Startups build on open source. It's essential to check the licenses of every dependency to avoid legal surprises — especially with GPL code.",
        tip: "Watch out for GPL dependencies in closed commercial products.",
      },
    ],
    licTitle: "The 3 main licenses",
    licSub: "Click to expand — you can open more than one",
    requireLabel: "What does it require?",
    permLabel: "Allowed",
    noPermLabel: "Not allowed",
    usedBy: "Real projects",
    exampleRepo: "View repo",
    exampleLicense: "View license",
    compTitle: "Quick comparison",
    consTitle: "What if I break it?",
    consSub: "Click to see real-world cases — you can open more than one",
    consCase: "Real case",
    consOutcome: "Outcome",
    tmplTitle: "Real GitHub templates",
    tmplSub: "Live data from GitHub API — click to see the full text",
    tmplSearch: "Search license…",
    tmplLoading: "Loading…",
    tmplCopy: "Copy text",
    tmplCopied: "Copied!",
    howTitle: "How to add a license",
    howSub: "Follow the steps — it's simpler than it looks",
    howSteps: [
      {
        n: "01", icon: "🎯", title: "Choose a license",
        desc: "Use choosealicense.com to find the right one for your case.",
        tip: "For most personal projects, MIT is the simplest choice.",
        action: "Open choosealicense.com →",
        actionUrl: "https://choosealicense.com/",
        visual: {
          type: "browser" as const,
          url: "choosealicense.com",
          content: ["🟢 MIT — I want something simple and permissive", "🔵 Apache 2.0 — I want patent protection", "🟠 GPLv3 — I want the code to always stay open"],
        },
      },
      {
        n: "02", icon: "📄", title: "Create the LICENSE file",
        desc: "In your GitHub repository, click 'Add file' → 'Create new file'. Type LICENSE as the name.",
        tip: "GitHub will automatically suggest license templates when the file is named LICENSE.",
        visual: {
          type: "github" as const,
          steps: ["Go to your repository page", "Click 'Add file' → 'Create new file'", "Type 'LICENSE' in the filename field", "Click 'Choose a license template' (appears automatically)", "Select your license and click 'Review and submit'"],
        },
      },
      {
        n: "03", icon: "📖", title: "Mention it in the README",
        desc: "Add a badge at the top of your README.md to make the license clear.",
        tip: "Badges are generated by shields.io and appear as images on GitHub.",
        code: "[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)",
        visual: { type: "badge" as const, preview: "MIT" },
      },
      {
        n: "04", icon: "✅", title: "Done!",
        desc: "Your project is now protected. Contributors and users know exactly what they can do.",
        tip: "Optionally, add an SPDX comment at the top of your source files:",
        code: "// SPDX-License-Identifier: MIT",
        visual: {
          type: "done" as const,
          items: ["LICENSE file created ✓", "README.md updated ✓", "Legal protection active ✓", "Contributors welcome ✓"],
        },
      },
    ],
    refTitle: "Official references",
    refSub: "Primary sources — recommended reading before making decisions",
    refs: [
      { title: "MIT License", org: "Open Source Initiative", desc: "Full legal text and official explanation of the MIT license.", url: "https://opensource.org/license/mit", tag: "MIT", tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
      { title: "Apache License 2.0", org: "Apache Software Foundation", desc: "Full documentation including patent terms.", url: "https://www.apache.org/licenses/LICENSE-2.0", tag: "Apache 2.0", tagColor: "bg-blue-50 text-blue-700 border-blue-200" },
      { title: "GNU GPL v3", org: "Free Software Foundation", desc: "GPLv3 text with explanations on copyleft and freedoms.", url: "https://www.gnu.org/licenses/gpl-3.0.html", tag: "GPLv3", tagColor: "bg-orange-50 text-orange-700 border-orange-200" },
      { title: "Creative Commons & Software", org: "Creative Commons FAQ", desc: "Why CC licenses are not recommended for code.", url: "https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software", tag: "CC FAQ", tagColor: "bg-purple-50 text-purple-700 border-purple-200" },
    ],
    faqTitle: "Frequently asked questions",
    faqItems: [
      { q: "No license = free to use?", a: "No. Without a license you keep all rights automatically by law (Berne Convention). No one can use, modify, or distribute it without your explicit permission — even if the code is public on GitHub." },
      { q: "Can I use MIT code in a paid app?", a: "Yes. MIT allows full commercial use. You just need to include the original copyright notice somewhere in your product (usually in the 'about' section or credits)." },
      { q: "Does Creative Commons work for code?", a: "Not recommended. Missing essential terms on compilation, source code, and patents. Use MIT (equivalent to CC-BY) or GPL (equivalent to CC-BY-SA)." },
      { q: "Can I change the license later?", a: "Only if you are the sole author. With external contributors you need everyone's permission — so choose carefully from the start." },
      { q: "What is GPL's viral effect?", a: "If you distribute software using GPL code, your code also becomes GPL. This ensures the software always stays open and free." },
      { q: "MIT vs Apache 2.0 — what's the real difference?", a: "Apache 2.0 adds explicit patent protection: if someone uses the software and then sues users over patents, they lose the right to use the Apache 2.0 code. MIT has no such mechanism." },
      { q: "What is tivoization, banned by GPLv3?", a: "Using GPL software in hardware locked to prevent users from installing modified versions — as TiVo did with Linux. GPLv3 explicitly prohibits this." },
      { q: "Can I have parts of my project under different licenses?", a: "Yes, carefully. Common to have core code in GPL and plugins in MIT. Just ensure the licenses are compatible — GPL and Apache 2.0 have known incompatibilities in certain uses." },
      { q: "What is public domain (Unlicense / CC0)?", a: "You waive all worldwide copyright. The code can be used by anyone, in any way, without even crediting you. It's irreversible." },
      { q: "Which license does GitHub recommend for new projects?", a: "GitHub recommends MIT for most projects — it's simple, widely understood, and compatible with almost every other license." },
    ],
    footerNote: "Educational content · Not legal advice",
    footerGithub: "View on GitHub",
  },
} as const;

/* ─── License data ─── */
const LICENSES = {
  pt: [
    {
      id: "mit", name: "MIT", emoji: "🟢", tagline: "A mais livre",
      color: "#22c55e", bg: "#f0fdf4", type: "Permissiva",
      oneLiner: "Faça o que quiser — só dê os créditos.",
      context: "A MIT é a licença de código aberto mais utilizada no mundo. Ela nasceu no MIT (Massachusetts Institute of Technology) na década de 1980 e se tornou popular por sua simplicidade extrema: apenas 171 palavras. Empresas como Meta, Google e Microsoft usam e publicam projetos sob MIT.",
      require: "Incluir o aviso de copyright em todas as cópias",
      can: ["Uso comercial", "Modificar o código", "Distribuir livremente", "Uso privado", "Sublicenciar"],
      cannot: ["Responsabilizar o autor por bugs"],
    },
    {
      id: "apache", name: "Apache 2.0", emoji: "🔵", tagline: "A corporativa",
      color: "#3b82f6", bg: "#eff6ff", type: "Permissiva",
      oneLiner: "Como a MIT, mas com proteção contra processos de patentes.",
      context: "Criada pela Apache Software Foundation, essa licença surgiu para resolver um problema real em ambientes corporativos: processos por violação de patentes. Se alguém usa o software e depois processa usuários por patentes relacionadas ao código, perde automaticamente o direito de usar o software Apache 2.0.",
      require: "Manter créditos + listar modificações nos arquivos alterados",
      can: ["Uso comercial", "Modificar o código", "Distribuir livremente", "Usar patentes incluídas"],
      cannot: ["Usar marcas registradas do projeto", "Responsabilizar o autor"],
    },
    {
      id: "gpl", name: "GNU GPLv3", emoji: "🟠", tagline: "A do código aberto",
      color: "#f97316", bg: "#fff7ed", type: "Copyleft",
      oneLiner: "Se usar o código, seu projeto também tem que ser aberto.",
      context: "Criada por Richard Stallman e a Free Software Foundation em 1989 (versão 3 em 2007), a GPL é a licença que define o movimento de software livre. Seu 'efeito viral' garante que nenhuma empresa possa pegar código aberto, fechar e vender sem devolver as melhorias para a comunidade.",
      require: "Disponibilizar código-fonte completo sob a mesma licença GPLv3",
      can: ["Uso comercial", "Modificar o código", "Distribuir livremente", "Uso privado"],
      cannot: ["Fechar o código de derivados", "Uso em software proprietário sem liberar fonte"],
    },
  ],
  en: [
    {
      id: "mit", name: "MIT", emoji: "🟢", tagline: "The freest one",
      color: "#22c55e", bg: "#f0fdf4", type: "Permissive",
      oneLiner: "Do whatever you want — just give credit.",
      context: "MIT is the most widely used open source license in the world. It was born at MIT (Massachusetts Institute of Technology) in the 1980s and became popular for its extreme simplicity: just 171 words. Companies like Meta, Google, and Microsoft use and publish projects under MIT.",
      require: "Include the copyright notice in all copies",
      can: ["Commercial use", "Modify the code", "Distribute freely", "Private use", "Sublicense"],
      cannot: ["Hold the author liable for bugs"],
    },
    {
      id: "apache", name: "Apache 2.0", emoji: "🔵", tagline: "The corporate one",
      color: "#3b82f6", bg: "#eff6ff", type: "Permissive",
      oneLiner: "Like MIT, but with patent lawsuit protection.",
      context: "Created by the Apache Software Foundation, this license was designed to solve a real problem in corporate environments: patent infringement lawsuits. If someone uses the software and then sues users over related patents, they automatically lose the right to use the Apache 2.0 software.",
      require: "Keep credits + list changes in modified files",
      can: ["Commercial use", "Modify the code", "Distribute freely", "Use included patents"],
      cannot: ["Use project trademarks", "Hold the author liable"],
    },
    {
      id: "gpl", name: "GNU GPLv3", emoji: "🟠", tagline: "The open-source guardian",
      color: "#f97316", bg: "#fff7ed", type: "Copyleft",
      oneLiner: "Use the code, your project must be open too.",
      context: "Created by Richard Stallman and the Free Software Foundation in 1989 (version 3 in 2007), the GPL defines the free software movement. Its 'viral effect' ensures no company can take open source code, close it, and sell it without returning improvements to the community.",
      require: "Release full source code under the same GPLv3 license",
      can: ["Commercial use", "Modify the code", "Distribute freely", "Private use"],
      cannot: ["Close source of derivatives", "Use in proprietary software without releasing source"],
    },
  ],
};

const LICENSE_EXAMPLES: Record<string, { name: string; stars: string; desc_pt: string; desc_en: string; repoUrl: string; licenseUrl: string; lang_label: string; }[]> = {
  mit: [
    { name: "React", stars: "228k", desc_pt: "Biblioteca de UI criada pelo Meta. Usada em milhões de apps web.", desc_en: "UI library created by Meta. Used in millions of web apps.", repoUrl: "https://github.com/facebook/react", licenseUrl: "https://github.com/facebook/react/blob/main/LICENSE", lang_label: "JavaScript" },
    { name: "Vue.js", stars: "207k", desc_pt: "Framework progressivo para interfaces. Criado por Evan You.", desc_en: "Progressive framework for UIs. Created by Evan You.", repoUrl: "https://github.com/vuejs/core", licenseUrl: "https://github.com/vuejs/core/blob/main/LICENSE", lang_label: "TypeScript" },
    { name: "jQuery", stars: "59k", desc_pt: "Biblioteca JS clássica que dominou a web por mais de uma década.", desc_en: "Classic JS library that dominated the web for over a decade.", repoUrl: "https://github.com/jquery/jquery", licenseUrl: "https://github.com/jquery/jquery/blob/main/LICENSE.txt", lang_label: "JavaScript" },
    { name: "Rails", stars: "55k", desc_pt: "Framework web Ruby criado por DHH no Basecamp.", desc_en: "Ruby web framework created by DHH at Basecamp.", repoUrl: "https://github.com/rails/rails", licenseUrl: "https://github.com/rails/rails/blob/main/MIT-LICENSE", lang_label: "Ruby" },
  ],
  apache: [
    { name: "Kubernetes", stars: "109k", desc_pt: "Sistema de orquestração de containers criado pelo Google.", desc_en: "Container orchestration system created by Google.", repoUrl: "https://github.com/kubernetes/kubernetes", licenseUrl: "https://github.com/kubernetes/kubernetes/blob/master/LICENSE", lang_label: "Go" },
    { name: "TensorFlow", stars: "185k", desc_pt: "Framework de machine learning do Google. Base de IA moderna.", desc_en: "Google's machine learning framework. Foundation of modern AI.", repoUrl: "https://github.com/tensorflow/tensorflow", licenseUrl: "https://github.com/tensorflow/tensorflow/blob/master/LICENSE", lang_label: "C++" },
    { name: "Swift", stars: "67k", desc_pt: "Linguagem de programação da Apple para iOS e macOS.", desc_en: "Apple's programming language for iOS and macOS.", repoUrl: "https://github.com/apple/swift", licenseUrl: "https://github.com/apple/swift/blob/main/LICENSE.txt", lang_label: "C++" },
    { name: "Android", stars: "14k", desc_pt: "Framework base do sistema operacional móvel do Google.", desc_en: "Base framework of Google's mobile operating system.", repoUrl: "https://github.com/aosp-mirror/platform_frameworks_base", licenseUrl: "https://github.com/aosp-mirror/platform_frameworks_base/blob/master/LICENSE", lang_label: "Java" },
  ],
  gpl: [
    { name: "Linux Kernel", stars: "179k", desc_pt: "Núcleo do OS Linux. Base de servidores, Android e supercomputadores.", desc_en: "Linux OS kernel. Foundation of servers, Android and supercomputers.", repoUrl: "https://github.com/torvalds/linux", licenseUrl: "https://github.com/torvalds/linux/blob/master/COPYING", lang_label: "C" },
    { name: "Git", stars: "52k", desc_pt: "Sistema de controle de versão criado por Linus Torvalds em 2005.", desc_en: "Version control system created by Linus Torvalds in 2005.", repoUrl: "https://github.com/git/git", licenseUrl: "https://github.com/git/git/blob/master/COPYING", lang_label: "C" },
    { name: "WordPress", stars: "19k", desc_pt: "CMS que alimenta 43% de todos os sites da internet.", desc_en: "CMS powering 43% of all websites on the internet.", repoUrl: "https://github.com/WordPress/WordPress", licenseUrl: "https://github.com/WordPress/WordPress/blob/master/license.txt", lang_label: "PHP" },
    { name: "GIMP", stars: "4.5k", desc_pt: "Editor de imagens open source. Alternativa gratuita ao Photoshop.", desc_en: "Open source image editor. Free alternative to Photoshop.", repoUrl: "https://gitlab.gnome.org/GNOME/gimp", licenseUrl: "https://gitlab.gnome.org/GNOME/gimp/-/blob/master/LICENSE", lang_label: "C" },
  ],
};

const CONSEQUENCES = {
  pt: [
    { id: "lawsuit", severity: "Alto", icon: "💸", color: "#ef4444", bg: "#fef2f2", title: "Processo por danos", desc: "Empresas e indivíduos podem entrar com ações judiciais pedindo indenização.", detail: "Copyright existe automaticamente pela Convenção de Berna — não precisa registrar nada. Qualquer uso não autorizado já configura violação passível de processo.", caseTitle: "SCO Group vs. IBM (2003)", caseDesc: "A SCO processou a IBM por US$ 5 bilhões alegando que código proprietário da SCO foi incorporado ilegalmente ao Linux. O caso durou mais de 10 anos nos tribunais.", outcome: "SCO foi à falência em 2007 com dívidas legais. IBM venceu. O caso definiu precedentes importantes para o mundo open source." },
    { id: "removal", severity: "Alto", icon: "🚫", color: "#ef4444", bg: "#fef2f2", title: "Remoção forçada", desc: "Um tribunal pode ordenar a retirada imediata do produto do mercado.", detail: "Além de indenização, o titular dos direitos pode pedir tutela antecipada para interromper a distribuição enquanto o processo corre.", caseTitle: "Linksys / Cisco & BusyBox (2006–2009)", caseDesc: "O Linksys WRT54G usava BusyBox (GPL) em seu firmware sem liberar o código-fonte. A FSF e a Software Freedom Conservancy acionaram a Cisco legalmente.", outcome: "A Cisco foi obrigada a liberar o código-fonte, pagar indenização e implementar um programa de conformidade com GPL. O caso virou referência." },
    { id: "exposure", severity: "Médio", icon: "📢", color: "#f97316", bg: "#fff7ed", title: "Exposição pública", desc: "Comunidades de devs monitoram violações. Casos viralizaram no passado.", detail: "Organizações como a Software Freedom Conservancy e a FSF monitoram ativamente violações de licença. Redes sociais amplificam casos rapidamente.", caseTitle: "Skype e código LGPL (2007)", caseDesc: "O Skype usava a biblioteca Qt sob LGPL mas não informava adequadamente os usuários sobre seus direitos de substituir a biblioteca. A FSF apontou a violação publicamente.", outcome: "Skype foi pressionado a atualizar sua política e documentação. O caso gerou debate global sobre transparência em licenciamento." },
    { id: "opensource", severity: "Médio", icon: "🔓", color: "#f97316", bg: "#fff7ed", title: "Forçado a abrir o código", desc: "Violar a GPL pode obrigar a publicação completa do seu código-fonte.", detail: "Este é o 'efeito viral' da GPL em ação jurídica. Se um produto comercial usa código GPL sem cumprir os termos, pode ser obrigado a liberar todo o código — incluindo partes proprietárias.", caseTitle: "Best Buy / Insignia (2009)", caseDesc: "A Software Freedom Law Center descobriu que TVs Insignia da Best Buy usavam código GPL (BusyBox, Linux) sem fornecer o código-fonte aos compradores.", outcome: "Best Buy foi obrigada a publicar o código-fonte dos produtos afetados e a estabelecer um programa interno de conformidade com licenças open source." },
    { id: "dmca", severity: "Baixo", icon: "⚠️", color: "#eab308", bg: "#fefce8", title: "DMCA Takedown", desc: "O titular envia uma notificação exigindo remoção imediata do conteúdo.", detail: "O DMCA permite que titulares de direitos exijam a remoção de conteúdo de plataformas como GitHub, npm e PyPI em horas.", caseTitle: "youtube-dl no GitHub (2020)", caseDesc: "A RIAA enviou um DMCA ao GitHub exigindo remoção do repositório youtube-dl, alegando que a ferramenta facilitava pirataria de conteúdo protegido.", outcome: "GitHub removeu o repo inicialmente, mas o restaurou após revisão. O caso gerou debate sobre abuso de DMCA." },
    { id: "settlement", severity: "Baixo", icon: "🤝", color: "#eab308", bg: "#fefce8", title: "Acordo extrajudicial", desc: "Muitos casos terminam em acordos pagos antes de ir a julgamento.", detail: "Processos de copyright são caros e longos. É comum o infrator pagar uma quantia para licenciar retroativamente o uso e evitar o julgamento.", caseTitle: "Oracle vs. Google — Java e Android (2010–2021)", caseDesc: "Oracle processou o Google por US$ 9 bilhões alegando que o Android copiava APIs do Java sem licença adequada. Foi o maior caso de copyright de software da história.", outcome: "Após 11 anos, a Suprema Corte decidiu a favor do Google (fair use). O custo do processo foi estimado em centenas de milhões em honorários." },
  ],
  en: [
    { id: "lawsuit", severity: "High", icon: "💸", color: "#ef4444", bg: "#fef2f2", title: "Lawsuit for damages", desc: "Companies and individuals can file lawsuits seeking compensation.", detail: "Copyright exists automatically under the Berne Convention — no registration needed. Any unauthorized use constitutes a violation subject to lawsuit.", caseTitle: "SCO Group vs. IBM (2003)", caseDesc: "SCO sued IBM for $5 billion alleging SCO's proprietary code was illegally incorporated into Linux. The case lasted over 10 years in courts.", outcome: "SCO went bankrupt in 2007. IBM won. The case set important precedents for the open source world." },
    { id: "removal", severity: "High", icon: "🚫", color: "#ef4444", bg: "#fef2f2", title: "Forced removal", desc: "A court can order immediate removal of a product from the market.", detail: "In addition to damages, the rights holder can seek a preliminary injunction to stop distribution while the case is ongoing.", caseTitle: "Linksys / Cisco & BusyBox (2006–2009)", caseDesc: "The Linksys WRT54G used BusyBox (GPL) in its firmware without releasing source code. The FSF and Software Freedom Conservancy took legal action against Cisco.", outcome: "Cisco was forced to release source code, pay damages, and implement a GPL compliance program. The case became a landmark reference." },
    { id: "exposure", severity: "Medium", icon: "📢", color: "#f97316", bg: "#fff7ed", title: "Public exposure", desc: "Dev communities monitor violations. Cases have gone viral in the past.", detail: "Organizations like the Software Freedom Conservancy and the FSF actively monitor license violations. Social media amplifies cases rapidly.", caseTitle: "Skype and LGPL code (2007)", caseDesc: "Skype used the Qt library under LGPL but didn't properly inform users about their rights to replace the library. The FSF publicly called out the violation.", outcome: "Skype was pressured to update its policy and documentation. The case generated global debate about transparency in licensing." },
    { id: "opensource", severity: "Medium", icon: "🔓", color: "#f97316", bg: "#fff7ed", title: "Forced to open source", desc: "Violating the GPL can require publishing your full source code.", detail: "This is the GPL's 'viral effect' in legal action. If a commercial product uses GPL code without complying, it may be forced to release all code — including proprietary parts.", caseTitle: "Best Buy / Insignia (2009)", caseDesc: "The Software Freedom Law Center discovered that Best Buy's Insignia TVs used GPL code (BusyBox, Linux) without providing source code to buyers.", outcome: "Best Buy was required to publish source code for affected products and establish an internal open source license compliance program." },
    { id: "dmca", severity: "Low", icon: "⚠️", color: "#eab308", bg: "#fefce8", title: "DMCA Takedown", desc: "The rights holder sends a notice demanding immediate removal of content.", detail: "The DMCA allows rights holders to demand removal of infringing content from platforms like GitHub, npm, and PyPI within hours.", caseTitle: "youtube-dl on GitHub (2020)", caseDesc: "The RIAA sent a DMCA notice to GitHub demanding removal of the youtube-dl repository, claiming the tool facilitated piracy of protected content.", outcome: "GitHub initially removed the repo but restored it after review. The case sparked debate about DMCA abuse." },
    { id: "settlement", severity: "Low", icon: "🤝", color: "#eab308", bg: "#fefce8", title: "Out-of-court settlement", desc: "Many cases end in paid settlements before going to trial.", detail: "Copyright lawsuits are expensive and lengthy. It's common for the infringer to pay to retroactively license the use and avoid trial.", caseTitle: "Oracle vs. Google — Java and Android (2010–2021)", caseDesc: "Oracle sued Google for $9 billion alleging Android copied Java APIs without proper licensing. It was the largest software copyright case in history.", outcome: "After 11 years, the Supreme Court ruled in Google's favor (fair use). The lawsuit cost was estimated at hundreds of millions in legal fees." },
  ],
};

interface GHLicense { key: string; name: string; spdx_id: string; }
interface GHLicenseDetail extends GHLicense { body: string; }

/* ═══════════════════ MAIN ═══════════════════ */
export default function App() {
  const [lang, setLang] = useState<Lang>("pt");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS);

  // all expandable sets — multi-open everywhere
  const [openHero, setOpenHero] = useState<Set<string>>(new Set());
  const [openWho, setOpenWho] = useState<Set<string>>(new Set());
  const [openPillars, setOpenPillars] = useState<Set<string>>(new Set());
  const [openReasons, setOpenReasons] = useState<Set<string>>(new Set());
  const [openLics, setOpenLics] = useState<Set<string>>(new Set());
  const [openExamples, setOpenExamples] = useState<Set<string>>(new Set());
  const [openCons, setOpenCons] = useState<Set<string>>(new Set());
  const [openFAQ, setOpenFAQ] = useState<Set<number>>(new Set());

  const [howtoStep, setHowtoStep] = useState(0);
  const [ghLicenses, setGhLicenses] = useState<GHLicense[]>([]);
  const [ghSearch, setGhSearch] = useState("");
  const [ghLoading, setGhLoading] = useState(false);
  const [selectedGh, setSelectedGh] = useState<GHLicenseDetail | null>(null);
  const [ghDetailLoading, setGhDetailLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const ui = UI[lang];
  const licenses = LICENSES[lang];
  const consequences = CONSEQUENCES[lang];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setGhLoading(true);
    fetch("https://api.github.com/licenses", { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => r.json()).then((d) => { setGhLicenses(d); setGhLoading(false); })
      .catch(() => setGhLoading(false));
  }, []);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const loadGhDetail = async (key: string) => {
    setSelectedGh(null); setGhDetailLoading(true);
    try { const r = await fetch(`https://api.github.com/licenses/${key}`, { headers: { Accept: "application/vnd.github+json" } }); setSelectedGh(await r.json()); }
    finally { setGhDetailLoading(false); }
  };
  const copyText = (text: string) => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  const filteredGh = ghLicenses.filter((l) => l.name.toLowerCase().includes(ghSearch.toLowerCase()) || l.spdx_id.toLowerCase().includes(ghSearch.toLowerCase()));

  /* reusable toggle icon */
  const ToggleIcon = ({ open, light = false }: { open: boolean; light?: boolean }) => (
    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${open ? (light ? "border-white/30 bg-white/15" : "border-black bg-black") : (light ? "border-white/20" : "border-black/15")}`}>
      {open
        ? <Minus className={`w-3 h-3 ${light ? "text-white" : "text-white"}`} />
        : <Plus className={`w-3 h-3 ${light ? "text-white/50" : "text-neutral-400"}`} />}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9]" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── NAV ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_12px_rgba(0,0,0,0.05)]" : ""}`}>
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="font-bold text-[15px] tracking-tight">licenses<span className="text-blue-500">.</span></span>
          <nav className="hidden lg:flex items-center gap-0.5">
            {SECTION_IDS.map((id, i) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${activeSection === id ? "bg-black text-white" : "text-neutral-500 hover:text-black hover:bg-black/5"}`}>
                {ui.nav[i]}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-100 rounded-full p-0.5">
              {(["pt", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all duration-200 ${lang === l ? "bg-black text-white shadow-sm" : "text-neutral-400 hover:text-black"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="lg:hidden bg-white border-b border-black/[0.06] px-5 py-3 flex flex-col gap-1">
              {SECTION_IDS.map((id, i) => (
                <button key={id} onClick={() => scrollTo(id)}
                  className={`text-[15px] text-left px-3 py-2.5 rounded-xl transition-colors ${activeSection === id ? "bg-black text-white font-medium" : "text-neutral-600 hover:bg-black/5"}`}>
                  {ui.nav[i]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-neutral-400 text-sm font-medium tracking-widest uppercase mb-8">{ui.heroEyebrow}</p>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.92] mb-8 whitespace-pre-line">{ui.heroTitle}</h1>
            <p className="text-neutral-400 text-xl md:text-2xl font-light mb-14 max-w-lg mx-auto leading-snug">{ui.heroSub}</p>
          </motion.div>

          {/* Hero analogy cards — interactive multi-open */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-3 gap-3 mb-14">
            {ui.heroCards.map((c) => {
              const isOpen = openHero.has(c.id);
              return (
                <div key={c.id}
                  onClick={() => setOpenHero((p) => toggleSet(p, c.id))}
                  className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden text-left ${isOpen ? "border-white/40 bg-white/[0.13]" : "border-white/[0.08] bg-white/[0.06] hover:bg-white/[0.1] hover:border-white/20"}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-1 mb-3">
                      <span className="text-3xl">{c.icon}</span>
                      <ToggleIcon open={isOpen} light />
                    </div>
                    <div className="font-bold text-white text-sm">{c.label}</div>
                    <div className="text-neutral-500 text-xs mt-0.5">{c.sub}</div>
                  </div>
                  <Expand open={isOpen}>
                    <div className="px-4 pb-4 flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="h-px bg-white/10" />
                      <p className="text-[12px] text-neutral-300 leading-relaxed text-left">{c.detail}</p>
                      <div className="flex flex-col gap-1.5">
                        {c.points.map((pt) => (
                          <div key={pt} className="flex items-start gap-2 text-[11px] text-neutral-400 text-left">
                            <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Expand>
                </div>
              );
            })}
          </motion.div>

          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            onClick={() => scrollTo("intro")}
            className="inline-flex items-center gap-2 bg-white text-black font-semibold px-7 py-3.5 rounded-full text-[15px] hover:bg-neutral-100 transition-colors">
            {ui.heroScroll} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section id="intro" className="py-24 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-blue-500 mb-4 px-3 py-1 bg-blue-50 rounded-full">{ui.introBadge}</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{ui.introHeading}</h2>
            <p className="text-neutral-400 font-medium">{ui.introSub}</p>
          </FadeIn>

          {/* Pillars — multi-open */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {ui.pillars.map((p, i) => {
              const isOpen = openPillars.has(p.id);
              return (
                <FadeIn key={p.id} delay={i * 0.1}>
                  <div className={`rounded-3xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isOpen ? "border-black shadow-xl" : `${p.color} border-transparent hover:shadow-md hover:border-black/10`}`}
                    style={isOpen ? { background: p.color.includes("purple") ? "#faf5ff" : p.color.includes("blue") ? "#eff6ff" : "#f0fdf4" } : undefined}
                    onClick={() => setOpenPillars((prev) => toggleSet(prev, p.id))}>
                    <div className="p-7">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{p.icon}</span>
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isOpen ? "border-black bg-black" : "border-neutral-200"}`}>
                          {isOpen ? <Minus className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-neutral-400" />}
                        </div>
                      </div>
                      <h3 className="font-black text-xl tracking-tight mb-2">{p.q}</h3>
                      <p className="text-neutral-600 text-[14px] leading-relaxed">{p.a}</p>
                    </div>
                    <Expand open={isOpen}>
                      <div className="px-7 pb-7 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                        <div className="h-px bg-black/10" />
                        <p className="text-[14px] text-neutral-700 leading-relaxed">{p.extra}</p>
                        <div className="flex flex-col gap-2">
                          {p.points.map((pt) => (
                            <div key={pt} className="flex items-center gap-2.5 text-sm font-medium">
                              <Check className="w-4 h-4 text-black flex-shrink-0" /><span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Reasons — multi-open */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {ui.reasons.map((r, i) => {
              const isOpen = openReasons.has(r.id);
              return (
                <FadeIn key={r.id} delay={i * 0.1}>
                  <div className={`rounded-3xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isOpen ? "border-black bg-black text-white shadow-xl" : "border-black/[0.07] bg-[#f9f9f9] hover:border-black/20 hover:shadow-sm"}`}
                    onClick={() => setOpenReasons((prev) => toggleSet(prev, r.id))}>
                    <div className="p-6 flex gap-4 items-start">
                      <span className="text-2xl flex-shrink-0 mt-0.5">{r.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className={`font-bold text-[15px] ${isOpen ? "text-white" : "text-black"}`}>{r.title}</h4>
                          <ToggleIcon open={isOpen} light={isOpen} />
                        </div>
                        <p className={`text-sm leading-relaxed ${isOpen ? "text-neutral-400" : "text-neutral-500"}`}>{r.desc}</p>
                      </div>
                    </div>
                    <Expand open={isOpen}>
                      <p className="px-6 pb-6 text-[13px] text-neutral-300 leading-relaxed border-t border-white/10 pt-4">{r.extra}</p>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Who — interactive multi-open inside black card */}
          <FadeIn>
            <div className="rounded-3xl bg-black text-white p-8">
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-6 text-center">{ui.pillars[2].q}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ui.who.map((w) => {
                  const isOpen = openWho.has(w.id);
                  return (
                    <div key={w.id}
                      onClick={() => setOpenWho((p) => toggleSet(p, w.id))}
                      className={`rounded-2xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isOpen ? "border-white/40 bg-white/[0.13]" : "border-white/[0.08] bg-white/[0.05] hover:bg-white/[0.09] hover:border-white/20"}`}>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-1 mb-2">
                          <span className="text-2xl">{w.icon}</span>
                          <ToggleIcon open={isOpen} light />
                        </div>
                        <div className="font-bold text-sm text-white">{w.label}</div>
                        <div className="text-neutral-500 text-xs mt-0.5">{w.sub}</div>
                      </div>
                      <Expand open={isOpen}>
                        <div className="px-4 pb-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                          <div className="h-px bg-white/10" />
                          <p className="text-[12px] text-neutral-300 leading-relaxed">{w.detail}</p>
                          <div className="flex items-start gap-1.5 mt-0.5">
                            <span className="text-amber-400 text-[10px] mt-0.5">💡</span>
                            <p className="text-[11px] text-neutral-500 leading-relaxed">{w.tip}</p>
                          </div>
                        </div>
                      </Expand>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── LICENSES ── */}
      <section id="licenses" className="py-24 px-5 bg-[#f9f9f9]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.licTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.licSub}</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {licenses.map((lic, i) => {
              const isOpen = openLics.has(lic.id);
              return (
                <FadeIn key={lic.id} delay={i * 0.1}>
                  <div className={`rounded-3xl border-2 transition-all duration-300 overflow-hidden ${isOpen ? "border-black shadow-xl" : "bg-white border-transparent hover:border-black/10 hover:shadow-md"}`}
                    style={isOpen ? { background: lic.bg } : undefined}>
                    <div className="p-6 cursor-pointer" onClick={() => setOpenLics((p) => toggleSet(p, lic.id))}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-3xl mb-2">{lic.emoji}</div>
                          <div className="font-black text-2xl tracking-tight">{lic.name}</div>
                          <div className="text-sm text-neutral-500 font-medium mt-0.5">{lic.tagline}</div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border" style={{ color: lic.color, borderColor: lic.color + "40", background: lic.color + "15" }}>{lic.type}</span>
                          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isOpen ? "border-black bg-black" : "border-neutral-200"}`}>
                            {isOpen ? <Minus className="w-3.5 h-3.5 text-white" /> : <Plus className="w-3.5 h-3.5 text-neutral-400" />}
                          </div>
                        </div>
                      </div>
                      <p className="text-[15px] font-medium text-neutral-700 leading-snug">{lic.oneLiner}</p>
                    </div>
                    <Expand open={isOpen}>
                      <div className="px-6 pb-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
                        <div className="h-px bg-black/10" />
                        <div className="bg-white/60 rounded-2xl p-4">
                          <p className="text-[13px] text-neutral-600 leading-relaxed">{lic.context}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{ui.requireLabel}</p>
                          <p className="text-sm font-medium text-neutral-800 bg-white/70 rounded-xl p-3 border border-black/[0.06]">{lic.require}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: lic.color }}>{ui.permLabel}</p>
                            <div className="flex flex-col gap-2">
                              {lic.can.map((c) => (
                                <div key={c} className="flex items-center gap-2 text-[13px]">
                                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: lic.color + "25" }}>
                                    <Check className="w-2.5 h-2.5" style={{ color: lic.color }} />
                                  </div>
                                  <span className="font-medium">{c}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-red-400 mb-2.5">{ui.noPermLabel}</p>
                            <div className="flex flex-col gap-2">
                              {lic.cannot.map((c) => (
                                <div key={c} className="flex items-center gap-2 text-[13px]">
                                  <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <X className="w-2.5 h-2.5 text-red-400" />
                                  </div>
                                  <span className="font-medium">{c}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">{ui.usedBy}</p>
                          <div className="flex flex-col gap-2">
                            {LICENSE_EXAMPLES[lic.id].map((ex) => {
                              const key = `${lic.id}-${ex.name}`;
                              const exOpen = openExamples.has(key);
                              return (
                                <div key={ex.name}>
                                  <button onClick={() => setOpenExamples((p) => toggleSet(p, key))}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all border-2 ${exOpen ? "bg-black text-white border-black" : "bg-white border-transparent hover:border-black/20 text-neutral-800 shadow-sm"}`}>
                                    <div className="flex items-center gap-3">
                                      <span className="font-black">{ex.name}</span>
                                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${exOpen ? "bg-white/15 text-white/70" : "bg-neutral-100 text-neutral-500"}`}>{ex.lang_label}</span>
                                      <span className={`text-[11px] font-medium ${exOpen ? "text-white/50" : "text-neutral-400"}`}>⭐ {ex.stars}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${exOpen ? "rotate-180 text-white/60" : "text-neutral-300"}`} />
                                  </button>
                                  <Expand open={exOpen}>
                                    <div className="mt-1.5 bg-black rounded-2xl p-4 flex flex-col gap-3">
                                      <p className="text-[13px] text-neutral-400 leading-relaxed">{lang === "pt" ? ex.desc_pt : ex.desc_en}</p>
                                      <div className="grid grid-cols-2 gap-2">
                                        <a href={ex.repoUrl} target="_blank" rel="noopener noreferrer"
                                          className="flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-bold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                                          <Github className="w-3.5 h-3.5" /> {ui.exampleRepo}
                                        </a>
                                        <a href={ex.licenseUrl} target="_blank" rel="noopener noreferrer"
                                          className="flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-bold text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                                          <FileText className="w-3.5 h-3.5" /> {ui.exampleLicense}
                                        </a>
                                      </div>
                                    </div>
                                  </Expand>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.3}>
            <div className="bg-black rounded-3xl p-6 md:p-8 text-white">
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-6 text-center">{ui.compTitle}</p>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div />
                {licenses.map((l) => <div key={l.id} className="font-black text-base">{l.emoji} {l.name}</div>)}
                {[
                  { label: lang === "pt" ? "Uso comercial" : "Commercial use", vals: [true, true, true] },
                  { label: lang === "pt" ? "Pode fechar código" : "Can close source", vals: [true, true, false] },
                  { label: lang === "pt" ? "Patentes" : "Patents", vals: [false, true, true] },
                  { label: lang === "pt" ? "Compartilhar igual" : "Share alike", vals: [false, false, true] },
                ].map((row) => (
                  <div key={row.label} className="contents">
                    <div className="text-neutral-400 text-left font-medium py-2 flex items-center text-[12px]">{row.label}</div>
                    {row.vals.map((v, i) => (
                      <div key={i} className="flex items-center justify-center py-2">
                        {v ? <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                          : <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center"><X className="w-3.5 h-3.5 text-neutral-600" /></div>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONSEQUENCES ── */}
      <section id="consequences" className="py-24 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.consTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.consSub}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consequences.map((c, i) => {
              const isOpen = openCons.has(c.id);
              return (
                <FadeIn key={c.id} delay={i * 0.08}>
                  <div className={`rounded-3xl border-2 cursor-pointer transition-all duration-300 overflow-hidden ${isOpen ? "border-black bg-black text-white shadow-xl" : "border-transparent hover:border-black/10 hover:shadow-md"}`}
                    style={!isOpen ? { background: c.bg } : undefined}
                    onClick={() => setOpenCons((p) => toggleSet(p, c.id))}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-3xl">{c.icon}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                            style={isOpen ? { color: c.color, background: c.color + "30" } : { color: c.color, background: c.color + "20" }}>
                            {c.severity}
                          </span>
                          <ToggleIcon open={isOpen} light={isOpen} />
                        </div>
                      </div>
                      <h3 className={`font-black text-[17px] tracking-tight mb-2 ${isOpen ? "text-white" : ""}`}>{c.title}</h3>
                      <p className={`text-sm leading-relaxed ${isOpen ? "text-neutral-400" : "text-neutral-600"}`}>{c.desc}</p>
                    </div>
                    <Expand open={isOpen}>
                      <div className="px-6 pb-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                        <div className="h-px bg-white/10" />
                        <p className="text-[13px] text-neutral-400 leading-relaxed">{c.detail}</p>
                        <div className="bg-white/[0.06] rounded-2xl p-4 border border-white/[0.08]">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.color }}>{ui.consCase}</p>
                          <p className="font-black text-[15px] text-white mb-2">{c.caseTitle}</p>
                          <p className="text-[13px] text-neutral-400 leading-relaxed mb-3">{c.caseDesc}</p>
                          <div className="border-t border-white/10 pt-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{ui.consOutcome}</p>
                            <p className="text-[13px] text-neutral-300 leading-relaxed">{c.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>
          <FadeIn delay={0.4} className="mt-8">
            <div className="rounded-3xl bg-[#f9f9f9] border border-black/[0.07] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-bold text-sm text-neutral-600">{lang === "pt" ? "Escala de severidade" : "Severity scale"}</p>
              <div className="flex items-center gap-4">
                {[{ label: lang === "pt" ? "Baixo" : "Low", c: "#eab308" }, { label: lang === "pt" ? "Médio" : "Medium", c: "#f97316" }, { label: lang === "pt" ? "Alto" : "High", c: "#ef4444" }].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />
                    <span className="text-sm font-medium text-neutral-600">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── GITHUB TEMPLATES ── */}
      <section id="templates" className="py-24 px-5 bg-[#f9f9f9]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 bg-black rounded-full text-white text-[12px] font-bold tracking-wide">
              <Github className="w-3.5 h-3.5" /> GitHub API — {lang === "pt" ? "dados ao vivo" : "live data"}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.tmplTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.tmplSub}</p>
          </FadeIn>
          <FadeIn className="mb-6">
            <div className="relative max-w-sm mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input value={ghSearch} onChange={(e) => setGhSearch(e.target.value)} placeholder={ui.tmplSearch}
                className="w-full bg-white border border-black/[0.08] rounded-full pl-11 pr-5 py-3 text-[14px] font-medium outline-none focus:border-black transition-colors shadow-sm" />
            </div>
          </FadeIn>
          {ghLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-neutral-400">
              <RefreshCw className="w-5 h-5 animate-spin" /><span className="font-medium">{ui.tmplLoading}</span>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredGh.map((lic, i) => (
                <FadeIn key={lic.key} delay={i * 0.03}>
                  <button onClick={() => loadGhDetail(lic.key)}
                    className="w-full text-left bg-white rounded-2xl border border-black/[0.07] p-5 hover:border-black hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[15px] tracking-tight truncate">{lic.name}</p>
                        <p className="text-xs font-mono text-neutral-400 mt-0.5">{lic.spdx_id}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-neutral-300 group-hover:text-black -rotate-90 transition-all flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section id="howto" className="py-24 px-5 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.howTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.howSub}</p>
          </FadeIn>
          <FadeIn>
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
              {ui.howSteps.map((s, i) => (
                <button key={s.n} onClick={() => setHowtoStep(i)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 ${howtoStep === i ? "bg-black text-white shadow-sm" : "bg-[#f9f9f9] text-neutral-400 hover:text-black border border-black/[0.07]"}`}>
                  <span>{s.icon}</span><span>{s.n}</span><span className="hidden sm:inline">{s.title}</span>
                </button>
              ))}
            </div>
          </FadeIn>
          <AnimatePresence mode="wait">
            <motion.div key={howtoStep} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
              {(() => {
                const step = ui.howSteps[howtoStep];
                return (
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="bg-[#f9f9f9] rounded-3xl border border-black/[0.07] p-7 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{step.icon}</span>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{step.n}</p>
                          <h3 className="font-black text-xl tracking-tight">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-[14px] text-neutral-600 leading-relaxed">{step.desc}</p>
                      {"tip" in step && step.tip && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
                          <p className="text-[13px] text-amber-800 leading-relaxed">💡 {step.tip}</p>
                        </div>
                      )}
                      {"action" in step && step.action && (
                        <a href={(step as any).actionUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
                          {step.action} <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {"code" in step && step.code && (
                        <div className="bg-black rounded-2xl p-4">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-2 flex items-center gap-1.5"><Terminal className="w-3 h-3" /> {lang === "pt" ? "Código" : "Code"}</p>
                          <pre className="text-[12px] font-mono text-emerald-400 whitespace-pre-wrap break-all leading-relaxed">{step.code}</pre>
                        </div>
                      )}
                    </div>
                    <div className="bg-black rounded-3xl p-6 flex flex-col gap-3">
                      {step.visual.type === "browser" && (<>
                        <div className="bg-neutral-800 rounded-xl p-3 flex items-center gap-2">
                          <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500" /><div className="w-2.5 h-2.5 rounded-full bg-yellow-500" /><div className="w-2.5 h-2.5 rounded-full bg-green-500" /></div>
                          <div className="flex-1 bg-neutral-700 rounded-md px-3 py-1 text-[11px] font-mono text-neutral-400">{step.visual.url}</div>
                        </div>
                        {step.visual.content.map((item) => (
                          <div key={item} className="bg-neutral-800 hover:bg-neutral-700 transition-colors rounded-xl px-4 py-3 text-[13px] text-neutral-300 font-medium cursor-pointer">{item}</div>
                        ))}
                      </>)}
                      {step.visual.type === "github" && (<>
                        <div className="bg-neutral-800 rounded-xl p-3 flex items-center gap-2 mb-1">
                          <Github className="w-4 h-4 text-white" />
                          <span className="text-[12px] font-mono text-neutral-400">github.com / seu-usuario / seu-repo</span>
                        </div>
                        {step.visual.steps.map((s, idx) => (
                          <div key={s} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[10px] font-black text-white">{idx + 1}</span>
                            </div>
                            <p className="text-[13px] text-neutral-300 leading-relaxed">{s}</p>
                          </div>
                        ))}
                      </>)}
                      {step.visual.type === "badge" && (
                        <div className="flex flex-col gap-4 items-start">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{lang === "pt" ? "Prévia" : "Preview"}</p>
                          <div className="bg-neutral-800 rounded-xl px-4 py-3 flex items-center">
                            <div className="bg-neutral-600 text-neutral-300 text-[11px] font-bold px-2 py-0.5 rounded-l">License</div>
                            <div className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-r">{step.visual.preview}</div>
                          </div>
                          <p className="text-[11px] text-neutral-500">{lang === "pt" ? "Aparece assim no seu README.md no GitHub" : "Appears like this in your README.md on GitHub"}</p>
                        </div>
                      )}
                      {step.visual.type === "done" && (
                        <div className="flex flex-col gap-3">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Checklist</p>
                          {step.visual.items.map((item) => (
                            <div key={item} className="flex items-center gap-3 bg-neutral-800 rounded-xl px-4 py-3">
                              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-[13px] text-neutral-300 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </AnimatePresence>
          <FadeIn className="flex justify-between items-center mt-6">
            <button onClick={() => setHowtoStep((p) => Math.max(0, p - 1))} disabled={howtoStep === 0}
              className="px-5 py-2.5 rounded-full text-[13px] font-bold border border-black/[0.1] text-neutral-400 hover:text-black hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              ← {lang === "pt" ? "Anterior" : "Previous"}
            </button>
            <div className="flex gap-1.5">
              {ui.howSteps.map((_, i) => (
                <button key={i} onClick={() => setHowtoStep(i)}
                  className={`h-2 rounded-full transition-all ${howtoStep === i ? "bg-black w-6" : "bg-neutral-300 w-2 hover:bg-neutral-400"}`} />
              ))}
            </div>
            <button onClick={() => setHowtoStep((p) => Math.min(ui.howSteps.length - 1, p + 1))} disabled={howtoStep === ui.howSteps.length - 1}
              className="px-5 py-2.5 rounded-full text-[13px] font-bold bg-black text-white hover:bg-neutral-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              {lang === "pt" ? "Próximo" : "Next"} →
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ── REFERENCES ── */}
      <section id="references" className="py-24 px-5 bg-[#f9f9f9]">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{ui.refTitle}</h2>
            <p className="text-neutral-400 font-medium">{ui.refSub}</p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-4">
            {ui.refs.map((ref, i) => (
              <FadeIn key={ref.url} delay={i * 0.08}>
                <a href={ref.url} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col gap-3 p-6 bg-white rounded-3xl border-2 border-transparent hover:border-black hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-[17px] tracking-tight group-hover:text-blue-600 transition-colors mb-0.5">{ref.title}</h3>
                      <p className="text-xs font-medium text-neutral-400">{ref.org}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${ref.tagColor}`}>{ref.tag}</span>
                      <ExternalLink className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors" />
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">{ref.desc}</p>
                  <p className="text-[11px] font-mono text-neutral-300 truncate">{ref.url}</p>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ — multi-open ── */}
      <section id="faq" className="py-24 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">{ui.faqTitle}</h2>
          </FadeIn>
          <div className="flex flex-col gap-2">
            {ui.faqItems.map((item, i) => {
              const isOpen = openFAQ.has(i);
              return (
                <FadeIn key={i} delay={i * 0.04}>
                  <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "border-black bg-black" : "border-black/[0.07] bg-[#f9f9f9] hover:border-black/20"}`}>
                    <button className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      onClick={() => setOpenFAQ((p) => { const n = new Set(p); if (n.has(i)) n.delete(i); else n.add(i); return n; })}>
                      <span className={`font-semibold text-[15px] ${isOpen ? "text-white" : "text-black"}`}>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : "text-neutral-400"}`} />
                    </button>
                    <Expand open={isOpen}>
                      <p className="px-5 pb-5 text-[14px] text-neutral-300 leading-relaxed">{item.a}</p>
                    </Expand>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black text-white py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-[15px]">licenses<span className="text-blue-400">.</span></span>
          <p className="text-neutral-500 text-sm">{ui.footerNote}</p>
          <div className="flex items-center gap-3">
            <a href="https://github.com/caioy0/licenses" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-neutral-400 hover:text-white transition-colors">
              <Github className="w-4 h-4" />{ui.footerGithub}
            </a>
            <div className="w-px h-4 bg-neutral-700" />
            <div className="flex items-center gap-1">
              {(["pt", "en"] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${lang === l ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {(ghDetailLoading || selectedGh) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) { setSelectedGh(null); setGhDetailLoading(false); } }}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              {ghDetailLoading ? (
                <div className="flex items-center justify-center py-24 gap-3 text-neutral-400">
                  <RefreshCw className="w-5 h-5 animate-spin" /><span className="font-medium">{ui.tmplLoading}</span>
                </div>
              ) : selectedGh ? (
                <>
                  <div className="flex items-start justify-between p-6 border-b border-black/[0.06]">
                    <div>
                      <h3 className="font-black text-xl tracking-tight">{selectedGh.name}</h3>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">{selectedGh.spdx_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyText(selectedGh.body)}
                        className="flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-2 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors">
                        {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? ui.tmplCopied : ui.tmplCopy}
                      </button>
                      <button onClick={() => setSelectedGh(null)} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1 p-6">
                    <pre className="text-[12px] font-mono text-neutral-700 leading-relaxed whitespace-pre-wrap break-words bg-[#f9f9f9] rounded-2xl p-5 border border-black/[0.06]">{selectedGh.body}</pre>
                  </div>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}