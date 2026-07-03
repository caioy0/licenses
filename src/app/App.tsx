import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Shield, Code2, Scale, Globe, Github, ArrowRight, Check, X, Menu, XIcon } from "lucide-react";

type Lang = "pt" | "en";

const T = {
  pt: {
    brand: "Licenças",
    nav: ["O que são", "Licenças", "Comparativo", "Ecossistema", "FAQ", "Referências"],
    heroBadge: "Guia Prático",
    heroTitle1: "Licenças de",
    heroTitle2: "Software",
    heroSubtitle:
      "Compreender licenças é fundamental para quem desenvolve, distribui ou consome código. Elas determinam o que os outros podem ou não fazer com o seu trabalho.",
    heroCta1: "Explorar licenças",
    heroCta2: "Ver comparativo",
    stats: [
      { value: "3", label: "Principais licenças" },
      { value: "2", label: "Categorias distintas" },
      { value: "∞", label: "Projetos protegidos" },
    ],
    whatBadge: "Fundamentos",
    whatTitle1: "O que são",
    whatTitle2: "licenças?",
    whatP1:
      "Uma licença de software é um contrato legal que define os termos de uso, modificação e distribuição de um programa. No mundo do código aberto (Open Source), elas são a base que estrutura toda a colaboração global entre desenvolvedores.",
    whatP2:
      "Sem uma licença, o direito autoral padrão se aplica — ninguém pode usar, copiar, modificar ou distribuir seu trabalho sem permissão explícita.",
    categories: [
      {
        label: "Permissivas",
        desc: "Liberdade total para usar, modificar e comercializar. Exigem apenas os créditos originais.",
        examples: "MIT, Apache 2.0",
      },
      {
        label: "Copyleft (Recíprocas)",
        desc: "Exigem que versões modificadas também sejam abertas sob a mesma licença.",
        examples: "GPLv3, LGPL",
      },
    ],
    licensesBadge: "Principais licenças",
    licensesTitle1: "Escolha com",
    licensesTitle2: "consciência",
    requirementLabel: "Exigência principal",
    permissionsLabel: "Permissões",
    usedByLabel: "Usado por",
    compBadge: "Análise",
    compTitle1: "Tabela",
    compTitle2: "comparativa",
    compCriteria: "Critério",
    compRows: [
      { label: "Tipo", mit: "Permissiva", apache: "Permissiva", gpl: "Copyleft (Forte)" },
      { label: "Uso comercial", mit: true, apache: true, gpl: "Parcial" },
      { label: "Pode ser proprietário", mit: true, apache: true, gpl: false },
      { label: "Proteção de patentes", mit: false, apache: true, gpl: true },
      { label: "Exige manter créditos", mit: true, apache: true, gpl: true },
      { label: "Exige listar alterações", mit: false, apache: true, gpl: true },
      { label: "Derivados devem ser abertos", mit: false, apache: false, gpl: true },
    ],
    ecoBadge: "Contexto",
    ecoTitle1: "O",
    ecoTitle2: "ecossistema",
    githubTitle: "Licenciamento no GitHub",
    githubSub: "Repositórios e direitos autorais",
    githubP:
      "O GitHub incentiva fortemente o uso de licenças claras. Repositórios publicados sem licença ficam automaticamente sob as leis de direitos autorais padrão — você retém todos os direitos, mas outros não podem usar o código legalmente.",
    chooseName: "choosealicense.com",
    chooseDesc:
      "Ferramenta criada pelo GitHub para guiar desenvolvedores na escolha da licença ideal respondendo a poucas perguntas simples.",
    ccTitle: "Creative Commons",
    ccSub: "Atenção!",
    ccP: "As licenças CC são excelentes para textos, imagens e música, mas não foram feitas para software. Carecem de termos sobre código-fonte, compilação e patentes.",
    ccNotMadeFor: "não foram feitas para software",
    pdBadge: "Domínio Público",
    pdTitle: "Unlicense & CC0",
    pdP:
      "Se o objetivo é abrir mão de absolutamente todos os direitos autorais mundiais, use a licença Unlicense ou a dedicação CC0. O código passa a ser de domínio público — qualquer pessoa pode fazer o que quiser, sem precisar sequer citar o seu nome.",
    pdItems: [
      { name: "Unlicense", desc: "Renúncia formal de todos os direitos, compatível com mais jurisdições" },
      { name: "CC0 (Creative Commons Zero)", desc: "Dedicação ao domínio público com fallback de licença permissiva" },
    ],
    faqBadge: "Dúvidas",
    faqTitle1: "Perguntas",
    faqTitle2: "frequentes",
    faqItems: [
      {
        q: "O que acontece se eu publicar código sem licença no GitHub?",
        a: "As leis de direitos autorais padrão se aplicam automaticamente, o que significa que você retém todos os direitos. Outros usuários podem ler e clonar seu código (conforme os Termos de Serviço do GitHub), mas não podem legalmente modificá-lo, distribuí-lo ou usá-lo em seus próprios projetos sem sua permissão explícita.",
      },
      {
        q: "Posso usar licenças Creative Commons para o meu software?",
        a: "Tecnicamente sim, mas não é recomendado. As licenças Creative Commons foram criadas para obras culturais e carecem de termos técnicos essenciais sobre código-fonte, compilação e patentes. Para código, prefira MIT (equivalente ao CC-BY) ou GPL (equivalente ao CC-BY-SA).",
      },
      {
        q: "O que é Domínio Público no contexto de software?",
        a: "Ao usar a licença Unlicense ou a dedicação CC0, você abre mão de absolutamente todos os direitos autorais mundiais. O código passa a ser de domínio público e qualquer pessoa pode fazer o que quiser com ele, sem precisar sequer citar o seu nome ou fornecer qualquer atribuição.",
      },
      {
        q: "Como escolho a licença certa para o meu projeto?",
        a: "Depende do seu objetivo. Se quer máxima adoção (inclusive comercial), use MIT. Se precisa de proteção corporativa contra patentes, use Apache 2.0. Se quer garantir que o código permaneça sempre aberto e livre, use GPLv3. O GitHub oferece a ferramenta choosealicense.com para ajudar nessa decisão.",
      },
      {
        q: "Posso mudar a licença do meu projeto depois?",
        a: "Sim, se você for o único detentor dos direitos autorais. Se outras pessoas já contribuíram para o projeto, você precisará da permissão de todos os contribuidores para relicenciar. Por isso é importante definir a licença certa antes de aceitar contribuições externas.",
      },
      {
        q: "O que é a 'tivoização' proibida pela GPLv3?",
        a: "Tivoização é a prática de usar software GPL em hardware que impede o usuário de instalar versões modificadas desse software — como o TiVo fazia com o Linux. A GPLv3 proíbe explicitamente essa prática, garantindo não apenas o acesso ao código, mas também a liberdade real de modificá-lo e executá-lo.",
      },
    ],
    refBadge: "Leitura oficial",
    refTitle1: "Referências",
    refTitle2: "primárias",
    refSubtitle:
      "Fontes oficiais para consulta aprofundada. Sempre verifique a documentação original antes de tomar decisões jurídicas.",
    refs: [
      {
        title: "MIT License",
        org: "Open Source Initiative",
        desc: "Texto oficial e explicação da licença MIT pela OSI, organização responsável pela certificação de licenças Open Source.",
        url: "https://opensource.org/license/mit",
        tag: "Permissiva",
        tagColor: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "Apache License 2.0",
        org: "Apache Software Foundation",
        desc: "Texto legal completo da Apache License 2.0, incluindo termos de concessão de patentes e condições de distribuição.",
        url: "https://www.apache.org/licenses/LICENSE-2.0",
        tag: "Permissiva",
        tagColor: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "GNU General Public License v3",
        org: "Free Software Foundation",
        desc: "Texto completo da GPLv3 pela FSF, com explicações sobre as liberdades do software e o efeito copyleft.",
        url: "https://www.gnu.org/licenses/gpl-3.0.html",
        tag: "Copyleft",
        tagColor: "bg-orange-50 text-orange-700",
      },
      {
        title: "Choose a License",
        org: "GitHub",
        desc: "Ferramenta interativa criada pelo GitHub para ajudar desenvolvedores a escolherem a licença mais adequada para seus projetos.",
        url: "https://choosealicense.com/",
        tag: "Ferramenta",
        tagColor: "bg-blue-50 text-blue-700",
      },
      {
        title: "Creative Commons e Software",
        org: "Creative Commons",
        desc: "FAQ oficial explicando por que as licenças Creative Commons não são recomendadas para software e quais alternativas usar.",
        url: "https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software",
        tag: "Referência",
        tagColor: "bg-purple-50 text-purple-700",
      },
    ],
    footerTagline: "— Guia prático de licenças de software",
    footerDisclaimer: "Conteúdo educacional · Não é aconselhamento jurídico",
    licenses: [
      {
        id: "mit",
        name: "MIT",
        tagline: "A mais simples e popular",
        type: "Permissiva",
        description:
          "Uma licença extremamente permissiva e minimalista. Ideal para quem quer maximizar o alcance do seu código, inclusive em produtos comerciais e proprietários.",
        features: [
          { text: "Uso comercial permitido", ok: true },
          { text: "Modificação permitida", ok: true },
          { text: "Distribuição permitida", ok: true },
          { text: "Sublicenciamento permitido", ok: true },
          { text: "Proteção de patentes", ok: false },
          { text: "Exige listar alterações", ok: false },
        ],
        requirement: "Apenas inclua o aviso de copyright original em todas as cópias.",
      },
      {
        id: "apache",
        name: "Apache 2.0",
        tagline: "Foco em empresas e patentes",
        type: "Permissiva",
        description:
          "Licença permissiva com proteção robusta contra litígios de patentes. Amplamente adotada por grandes corporações e projetos de infraestrutura crítica.",
        features: [
          { text: "Uso comercial permitido", ok: true },
          { text: "Modificação permitida", ok: true },
          { text: "Distribuição permitida", ok: true },
          { text: "Proteção de patentes", ok: true },
          { text: "Defesa contra processos de patentes", ok: true },
          { text: "Exige listar alterações", ok: true },
        ],
        requirement:
          "Inclua o aviso de copyright, a licença e liste as modificações significativas nos arquivos alterados.",
      },
      {
        id: "gpl",
        name: "GNU GPLv3",
        tagline: "A defensora do Open Source",
        type: "Copyleft (Forte)",
        description:
          "A licença Copyleft mais famosa, criada pela Free Software Foundation. Garante que o software e todas as suas evoluções permaneçam sempre livres e abertos.",
        features: [
          { text: "Uso pessoal e comercial", ok: true },
          { text: "Modificação permitida", ok: true },
          { text: "Proteção de patentes", ok: true },
          { text: "Proíbe tivoização de hardware", ok: true },
          { text: "Derivados devem ser open source", ok: false },
          { text: "Uso em software proprietário", ok: false },
        ],
        requirement:
          "Efeito viral: qualquer derivado deve ser distribuído sob a mesma licença GPLv3 com o código-fonte completo disponível.",
      },
    ],
  },
  en: {
    brand: "Licenses",
    nav: ["What are they", "Licenses", "Comparison", "Ecosystem", "FAQ", "References"],
    heroBadge: "Practical Guide",
    heroTitle1: "Software",
    heroTitle2: "Licenses",
    heroSubtitle:
      "Understanding licenses is essential for anyone who develops, distributes, or consumes code. They determine what others can or cannot do with your work.",
    heroCta1: "Explore licenses",
    heroCta2: "See comparison",
    stats: [
      { value: "3", label: "Main licenses" },
      { value: "2", label: "Distinct categories" },
      { value: "∞", label: "Protected projects" },
    ],
    whatBadge: "Fundamentals",
    whatTitle1: "What are",
    whatTitle2: "licenses?",
    whatP1:
      "A software license is a legal agreement that defines the terms of use, modification, and distribution of a program. In the Open Source world, licenses are the foundation that structures all global collaboration between developers.",
    whatP2:
      "Without a license, standard copyright law applies — no one can use, copy, modify, or distribute your work without explicit permission.",
    categories: [
      {
        label: "Permissive",
        desc: "Full freedom to use, modify, and commercialize. Only require original credits.",
        examples: "MIT, Apache 2.0",
      },
      {
        label: "Copyleft (Reciprocal)",
        desc: "Require that modified versions also be open under the same license.",
        examples: "GPLv3, LGPL",
      },
    ],
    licensesBadge: "Main licenses",
    licensesTitle1: "Choose with",
    licensesTitle2: "awareness",
    requirementLabel: "Main requirement",
    permissionsLabel: "Permissions",
    usedByLabel: "Used by",
    compBadge: "Analysis",
    compTitle1: "Comparison",
    compTitle2: "table",
    compCriteria: "Criteria",
    compRows: [
      { label: "Type", mit: "Permissive", apache: "Permissive", gpl: "Copyleft (Strong)" },
      { label: "Commercial use", mit: true, apache: true, gpl: "Partial" },
      { label: "Can be proprietary", mit: true, apache: true, gpl: false },
      { label: "Patent protection", mit: false, apache: true, gpl: true },
      { label: "Must keep credits", mit: true, apache: true, gpl: true },
      { label: "Must list changes", mit: false, apache: true, gpl: true },
      { label: "Derivatives must be open", mit: false, apache: false, gpl: true },
    ],
    ecoBadge: "Context",
    ecoTitle1: "The",
    ecoTitle2: "ecosystem",
    githubTitle: "Licensing on GitHub",
    githubSub: "Repositories and copyright",
    githubP:
      "GitHub strongly encourages the use of clear licenses. Repositories published without a license are automatically subject to standard copyright laws — you retain all rights, but others cannot legally use the code.",
    chooseName: "choosealicense.com",
    chooseDesc:
      "A tool created by GitHub to guide developers in choosing the ideal license by answering a few simple questions.",
    ccTitle: "Creative Commons",
    ccSub: "Caution!",
    ccP: "CC licenses are excellent for text, images, and music, but were not made for software. They lack essential technical terms about source code, compilation, and patents.",
    ccNotMadeFor: "were not made for software",
    pdBadge: "Public Domain",
    pdTitle: "Unlicense & CC0",
    pdP:
      "If the goal is to waive absolutely all worldwide copyright, use the Unlicense or CC0 dedication. The code becomes public domain — anyone can do whatever they want with it, without even having to credit your name.",
    pdItems: [
      { name: "Unlicense", desc: "Formal waiver of all rights, compatible with more jurisdictions" },
      { name: "CC0 (Creative Commons Zero)", desc: "Public domain dedication with a permissive license fallback" },
    ],
    faqBadge: "Questions",
    faqTitle1: "Frequently",
    faqTitle2: "asked questions",
    faqItems: [
      {
        q: "What happens if I publish code without a license on GitHub?",
        a: "Standard copyright laws apply automatically, meaning you retain all rights. Other users can read and clone your code (per GitHub's Terms of Service), but they cannot legally modify it, distribute it, or use it in their own projects without your explicit permission.",
      },
      {
        q: "Can I use Creative Commons licenses for my software?",
        a: "Technically yes, but it is not recommended. Creative Commons licenses were created for cultural works and lack essential technical terms about source code, compilation, and patents. For code, prefer MIT (equivalent to CC-BY) or GPL (equivalent to CC-BY-SA).",
      },
      {
        q: "What is Public Domain in the context of software?",
        a: "By using the Unlicense or CC0 dedication, you waive absolutely all worldwide copyrights. The code becomes public domain and anyone can do whatever they want with it, without needing to credit your name or provide any attribution.",
      },
      {
        q: "How do I choose the right license for my project?",
        a: "It depends on your goal. If you want maximum adoption (including commercial), use MIT. If you need corporate patent protection, use Apache 2.0. If you want to ensure the code always remains open and free, use GPLv3. GitHub offers the choosealicense.com tool to help with this decision.",
      },
      {
        q: "Can I change my project's license later?",
        a: "Yes, if you are the sole copyright holder. If others have already contributed to the project, you will need permission from all contributors to relicense. That is why it is important to define the right license before accepting external contributions.",
      },
      {
        q: "What is 'tivoization' prohibited by GPLv3?",
        a: "Tivoization is the practice of using GPL software in hardware that prevents the user from installing modified versions of that software — as TiVo did with Linux. GPLv3 explicitly prohibits this practice, ensuring not just access to the code, but also the real freedom to modify and run it.",
      },
    ],
    refBadge: "Official reading",
    refTitle1: "Primary",
    refTitle2: "references",
    refSubtitle:
      "Official sources for in-depth consultation. Always check the original documentation before making legal decisions.",
    refs: [
      {
        title: "MIT License",
        org: "Open Source Initiative",
        desc: "Official text and explanation of the MIT license by OSI, the organization responsible for certifying Open Source licenses.",
        url: "https://opensource.org/license/mit",
        tag: "Permissive",
        tagColor: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "Apache License 2.0",
        org: "Apache Software Foundation",
        desc: "Complete legal text of Apache License 2.0, including patent grant terms and distribution conditions.",
        url: "https://www.apache.org/licenses/LICENSE-2.0",
        tag: "Permissive",
        tagColor: "bg-emerald-50 text-emerald-700",
      },
      {
        title: "GNU General Public License v3",
        org: "Free Software Foundation",
        desc: "Full text of GPLv3 by the FSF, with explanations of software freedoms and the copyleft effect.",
        url: "https://www.gnu.org/licenses/gpl-3.0.html",
        tag: "Copyleft",
        tagColor: "bg-orange-50 text-orange-700",
      },
      {
        title: "Choose a License",
        org: "GitHub",
        desc: "Interactive tool created by GitHub to help developers choose the most appropriate license for their projects.",
        url: "https://choosealicense.com/",
        tag: "Tool",
        tagColor: "bg-blue-50 text-blue-700",
      },
      {
        title: "Creative Commons and Software",
        org: "Creative Commons",
        desc: "Official FAQ explaining why Creative Commons licenses are not recommended for software and which alternatives to use.",
        url: "https://creativecommons.org/faq/#can-i-apply-a-creative-commons-license-to-software",
        tag: "Reference",
        tagColor: "bg-purple-50 text-purple-700",
      },
    ],
    footerTagline: "— Practical guide to software licenses",
    footerDisclaimer: "Educational content · Not legal advice",
    licenses: [
      {
        id: "mit",
        name: "MIT",
        tagline: "The simplest and most popular",
        type: "Permissive",
        description:
          "An extremely permissive and minimalist license. Ideal for those who want to maximize the reach of their code, including in commercial and proprietary products.",
        features: [
          { text: "Commercial use allowed", ok: true },
          { text: "Modification allowed", ok: true },
          { text: "Distribution allowed", ok: true },
          { text: "Sublicensing allowed", ok: true },
          { text: "Patent protection", ok: false },
          { text: "Must list changes", ok: false },
        ],
        requirement: "Just include the original copyright notice in all copies.",
      },
      {
        id: "apache",
        name: "Apache 2.0",
        tagline: "Focus on enterprises and patents",
        type: "Permissive",
        description:
          "A permissive license with robust protection against patent litigation. Widely adopted by large corporations and critical infrastructure projects.",
        features: [
          { text: "Commercial use allowed", ok: true },
          { text: "Modification allowed", ok: true },
          { text: "Distribution allowed", ok: true },
          { text: "Patent protection", ok: true },
          { text: "Defense against patent lawsuits", ok: true },
          { text: "Must list changes", ok: true },
        ],
        requirement:
          "Include the copyright notice, the license, and list significant modifications in changed files.",
      },
      {
        id: "gpl",
        name: "GNU GPLv3",
        tagline: "The defender of Open Source",
        type: "Copyleft (Strong)",
        description:
          "The most famous Copyleft license, created by the Free Software Foundation. Ensures that the software and all its evolutions always remain free and open.",
        features: [
          { text: "Personal and commercial use", ok: true },
          { text: "Modification allowed", ok: true },
          { text: "Patent protection", ok: true },
          { text: "Prohibits hardware tivoization", ok: true },
          { text: "Derivatives must be open source", ok: false },
          { text: "Use in proprietary software", ok: false },
        ],
        requirement:
          "Viral effect: any derivative must be distributed under the same GPLv3 license with the full source code available.",
      },
    ],
  },
} as const;

const LICENSE_META = [
  { id: "mit", typeColor: "text-emerald-600", typeBg: "bg-emerald-50", icon: Code2, examples: ["React", "Vue.js", "jQuery", "Rails"] },
  { id: "apache", typeColor: "text-blue-600", typeBg: "bg-blue-50", icon: Shield, examples: ["Kubernetes", "Android", "Swift", "TensorFlow"] },
  { id: "gpl", typeColor: "text-orange-600", typeBg: "bg-orange-50", icon: Scale, examples: ["Linux Kernel", "Git", "WordPress", "GIMP"] },
];

const SECTION_IDS = ["o-que-sao", "licencas", "comparativo", "ecossistema", "faq", "referencias"];

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 80;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return active;
}

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
  if (val === false) return <X className="w-4 h-4 text-red-400 mx-auto" />;
  return <span className="text-xs text-muted-foreground font-medium">{val}</span>;
}

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-start justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[15px] font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted-foreground text-[15px] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>("pt");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLicense, setActiveLicense] = useState("mit");
  const activeSection = useScrollSpy(SECTION_IDS);
  const t = T[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = SECTION_IDS.map((id, i) => ({ href: `#${id}`, label: t.nav[i] }));
  const currentLicense = t.licenses.find((l) => l.id === activeLicense)!;
  const currentMeta = LICENSE_META.find((m) => m.id === activeLicense)!;

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* NAV */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/85 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-tight text-foreground flex-shrink-0">
            {t.brand}<span className="text-primary">.</span>
          </span>

          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`px-3 py-1.5 rounded-full text-[13px] transition-colors whitespace-nowrap ${
                  activeSection === l.href.replace("#", "")
                    ? "text-primary font-medium bg-blue-50"
                    : "text-muted-foreground hover:text-foreground hover:bg-gray-100"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language toggle */}
            <div className="flex items-center bg-card border border-border rounded-full p-0.5 gap-0.5">
              {(["pt", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all duration-200 ${
                    lang === l
                      ? "bg-foreground text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              className="lg:hidden text-foreground p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-border px-6 py-3 flex flex-col"
            >
              {navLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className={`text-[15px] text-left py-3 border-b border-border/50 last:border-0 transition-colors ${
                    activeSection === l.href.replace("#", "")
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-6 px-3 py-1 bg-blue-50 rounded-full">
            {t.heroBadge}
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground leading-none mb-6">
            {t.heroTitle1}
            <br />
            <span className="font-semibold">{t.heroTitle2}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {t.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollTo("#licencas")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[14px] font-medium rounded-full hover:bg-blue-600 transition-colors"
            >
              {t.heroCta1} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo("#comparativo")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground text-[14px] font-medium rounded-full hover:bg-gray-100 transition-colors border border-border"
            >
              {t.heroCta2}
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-20 flex justify-center gap-12 md:gap-20"
        >
          {t.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-light text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* O QUE SÃO */}
      <section id="o-que-sao" className="py-24 px-6 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t.whatBadge}</p>
              <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
                {t.whatTitle1}<br /><span className="font-semibold">{t.whatTitle2}</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">{t.whatP1}</p>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{t.whatP2}</p>
            </div>
            <div className="flex flex-col gap-4">
              {t.categories.map((cat, i) => (
                <div
                  key={cat.label}
                  className={`p-6 rounded-2xl border ${
                    i === 0 ? "border-emerald-200 bg-emerald-50/50" : "border-orange-200 bg-orange-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground text-[15px]">{cat.label}</h3>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {cat.examples}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LICENÇAS */}
      <section id="licencas" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t.licensesBadge}</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              {t.licensesTitle1} <span className="font-semibold">{t.licensesTitle2}</span>
            </h2>
          </div>

          <div className="flex justify-center gap-2 mb-10">
            {t.licenses.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLicense(l.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeLicense === l.id
                    ? "bg-foreground text-white shadow-sm"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeLicense}-${lang}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-5 gap-6"
            >
              <div className="md:col-span-3 bg-card rounded-3xl p-8 border border-border">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight">{currentLicense.name}</h3>
                    <p className="text-muted-foreground mt-1 text-sm">{currentLicense.tagline}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${currentMeta.typeBg} ${currentMeta.typeColor}`}>
                    {currentLicense.type}
                  </span>
                </div>
                <p className="text-[15px] leading-relaxed text-muted-foreground mb-8">{currentLicense.description}</p>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wide">{t.requirementLabel}</p>
                  <p className="text-sm text-foreground leading-relaxed">{currentLicense.requirement}</p>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-5">
                <div className="bg-card rounded-3xl p-6 border border-border flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{t.permissionsLabel}</p>
                  <div className="flex flex-col gap-3">
                    {currentLicense.features.map((f) => (
                      <div key={f.text} className="flex items-center gap-3">
                        {f.ok ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                            <X className="w-3 h-3 text-red-400" />
                          </div>
                        )}
                        <span className="text-sm text-foreground">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-3xl p-6 border border-border">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{t.usedByLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentMeta.examples.map((ex) => (
                      <span key={ex} className="text-xs px-3 py-1.5 bg-background border border-border rounded-full text-foreground font-medium">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {t.licenses.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setActiveLicense(l.id)}
                className={`text-left p-5 rounded-2xl border transition-all ${
                  activeLicense === l.id
                    ? "border-primary bg-blue-50/50"
                    : "border-border bg-card hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-foreground">{l.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${LICENSE_META[i].typeBg} ${LICENSE_META[i].typeColor}`}>
                    {l.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{l.tagline}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section id="comparativo" className="py-24 px-6 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t.compBadge}</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              {t.compTitle1} <span className="font-semibold">{t.compTitle2}</span>
            </h2>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-border bg-background shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 font-semibold text-foreground w-1/2">{t.compCriteria}</th>
                  {t.licenses.map((l, i) => (
                    <th key={l.id} className="px-4 py-4 text-center font-semibold text-foreground">
                      <div className="flex flex-col items-center gap-1">
                        <span>{l.name}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${LICENSE_META[i].typeBg} ${LICENSE_META[i].typeColor}`}>
                          {l.type}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.compRows.map((row, i) => (
                  <tr key={row.label} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-card/30"}`}>
                    <td className="px-6 py-4 text-foreground font-medium">{row.label}</td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.mit} /></td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.apache} /></td>
                    <td className="px-4 py-4 text-center"><CellValue val={row.gpl} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ECOSSISTEMA */}
      <section id="ecossistema" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t.ecoBadge}</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              {t.ecoTitle1} <span className="font-semibold">{t.ecoTitle2}</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 bg-card rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t.githubTitle}</h3>
                  <p className="text-xs text-muted-foreground">{t.githubSub}</p>
                </div>
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-5">{t.githubP}</p>
              <div className="p-4 bg-background rounded-2xl border border-border">
                <p className="text-xs font-semibold text-foreground mb-1">{t.chooseName}</p>
                <p className="text-sm text-muted-foreground">{t.chooseDesc}</p>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-yellow-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{t.ccTitle}</h3>
                  <p className="text-xs text-muted-foreground">{t.ccSub}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {t.ccP.split(t.ccNotMadeFor)[0]}
                <strong className="text-foreground">{t.ccNotMadeFor}</strong>
                {t.ccP.split(t.ccNotMadeFor)[1]}
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <span>CC-BY → use MIT</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ArrowRight className="w-3 h-3 text-primary" />
                  <span>CC-BY-SA → use GPL</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 bg-foreground rounded-3xl p-8 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-white/50 block mb-3">{t.pdBadge}</span>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{t.pdTitle}</h3>
                  <p className="text-white/70 leading-relaxed text-[15px]">{t.pdP}</p>
                </div>
                <div className="flex flex-col gap-3">
                  {t.pdItems.map((item) => (
                    <div key={item.name} className="p-4 rounded-2xl bg-white/10 border border-white/10">
                      <p className="font-semibold text-sm text-white mb-1">{item.name}</p>
                      <p className="text-xs text-white/60 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t.faqBadge}</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              {t.faqTitle1} <span className="font-semibold">{t.faqTitle2}</span>
            </h2>
          </div>
          <div className="bg-background rounded-3xl border border-border px-8">
            {t.faqItems.map((item, i) => (
              <AccordionItem key={`${lang}-${i}`} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* REFERÊNCIAS */}
      <section id="referencias" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t.refBadge}</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              {t.refTitle1} <span className="font-semibold">{t.refTitle2}</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-[15px] max-w-xl mx-auto">{t.refSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {t.refs.map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 p-6 bg-card rounded-3xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-[15px] group-hover:text-primary transition-colors mb-1">
                      {ref.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">{ref.org}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${ref.tagColor}`}>{ref.tag}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{ref.desc}</p>
                <p className="text-[11px] text-muted-foreground/60 font-mono truncate">{ref.url}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {t.brand}<span className="text-primary">.</span>
            </span>
            <span className="text-muted-foreground text-sm">{t.footerTagline}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{t.footerDisclaimer}</p>
        </div>
      </footer>
    </div>
  );
}
