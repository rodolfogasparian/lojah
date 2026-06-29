type Benefit = { icon?: string; imageUrl?: string; title: string; description: string };
type Differential = { icon?: string; title: string; description: string };
type Testimonial = { videoUrl: string; name?: string; role?: string; thumbnail?: string };
type Product = { imageUrl: string; alt?: string };
type ValueCard = { title: string; description: string; value?: string; icon?: string };
type Kit = {
  name: string;
  image?: string;
  price: string;
  oldPrice?: string;
  description?: string;
  highlights: string[];
  whatsappMessage?: string;
  badge?: string;
  catalogUrl?: string;
};
type FAQItem = { question: string; answer: string };
type FooterLink = { label: string; href: string };

export type LandingNaturaisData = {
  whatsapp: string;
  defaultWhatsappMessage?: string;
  brand: { name: string; logoUrl?: string };
  topBar: { text: string; region?: string };
  hero: {
    badge?: string;
    title: string;
    highlight?: string;
    subtitle: string;
    imageUrl: string;
    ctaLabel: string;
    bullets?: string[];
  };
  benefits: { title: string; subtitle?: string; items: Benefit[] };
  differentials: { title: string; subtitle?: string; items: Differential[] };
  testimonials: { title: string; subtitle?: string; items: Testimonial[] };
  gallery: { title: string; subtitle?: string; items: Product[] };
  values: { title: string; subtitle?: string; items: ValueCard[] };
  kits: { title: string; subtitle?: string; items: Kit[] };
  faq: { title: string; subtitle?: string; items: FAQItem[] };
  footer: {
    description?: string;
    columns: { title: string; links: FooterLink[] }[];
    contact: { whatsappLabel: string; email?: string; hours?: string };
    paymentMethods: string[];
    copyright: string;
  };
};

export const defaultPageData: LandingNaturaisData = {
  whatsapp: "5511999999999",
  defaultWhatsappMessage:
    "Olá! Quero ser consultor(a) e receber mais informações sobre os kits.",
  brand: {
    name: "Atlântica Natural",
    logoUrl:
      "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/logo-atlantica-fundo-branco.png",
  },
  topBar: {
    text: "Vagas abertas para consultores(as) em todo o Brasil",
    region: "Atendimento nacional",
  },
  hero: {
    title: "Faça parte do Maior Ecossistema de Produtos e Serviços do Brasil!",
    subtitle: "Empreenda com propósito. Cresça com o maior ecossistema em vendas diretas!",
    imageUrl:
      "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/21-maior-ecossistema.png",
    ctaLabel: "Quero saber mais",
    bullets: [
      "Mais de 300 produtos para revender com até 100% de lucro",
      "Ecossistema de serviços digitais com comissões recorrentes",
      "Trabalhe de casa ou pelo celular no seu próprio horário",
    ],
  },
  benefits: {
    title: "Você escolhe onde lucrar!",
    subtitle: "Dois ecossistemas completos para você empreender",
    items: [
      {
        imageUrl:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/3-banner-300-produtos.png",
        title: "Ecossistema de Produtos",
        description:
          "Mais de 300 produtos: Suplementação, Vitaminas, Perfumaria Fina, Óleos Ozonizados, Linha Capilar e Cuidados Diários. Lucro de até 100% na revenda.",
      },
      {
        imageUrl:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/20-banner-atl-onmed.png",
        title: "ATL ON MED",
        description:
          "Assistência médica acessível para toda a família. Comissões recorrentes por cada novo cliente.",
      },
      {
        imageUrl:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/11-banner-chip.png",
        title: "ATL NEX — Telefonia",
        description:
          "Planos de telefonia digital. Ganhe comissão recorrente enquanto seu cliente usar o plano.",
      },
      {
        imageUrl:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/20-energia-assinatura.png",
        title: "Energia por Assinatura",
        description:
          "Até 55% de comissão por cada novo cliente de energia. Renda passiva todo mês.",
      },
      {
        imageUrl:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/17-banner-apps.png",
        title: "ATL APPs",
        description:
          "Aplicativos e soluções digitais. Tecnologia que conecta, soluções que transformam.",
      },
      {
        imageUrl:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/18-banner-renda-recorrente.png",
        title: "Renda Recorrente",
        description:
          "Receba renda recorrente de todo o sistema de produtos e serviços.",
      },
    ],
  },
  differentials: {
    title: "Por que ser consultor(a) Atlântica?",
    subtitle: "Um modelo de negócio completo para você",
    items: [
      {
        icon: "🏠",
        title: "Trabalhe de casa",
        description: "Faça tudo pelo celular, no seu ritmo e horário.",
      },
      {
        icon: "📈",
        title: "Renda recorrente",
        description: "Serviços que renovam todo mês geram comissão automática.",
      },
      {
        icon: "🎓",
        title: "Treinamento completo",
        description: "Receba todo suporte e treinamento necessário para vender.",
      },
      {
        icon: "🤝",
        title: "Suporte do consultor(a)",
        description: "Você terá acompanhamento direto do seu consultor(a) responsável.",
      },
    ],
  },
  testimonials: {
    title: "Histórias reais de quem já começou",
    subtitle: "Veja o que nossos consultores(as) estão conquistando.",
    items: [
      { videoUrl: "https://player.vimeo.com/video/687733508", name: "Depoimento 1" },
      { videoUrl: "https://player.vimeo.com/video/687733046", name: "Depoimento 2" },
    ],
  },
  gallery: {
    title: "Conheça nossos produtos",
    items: [
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/4-banner-linha-de-produtos.png", alt: "Linha de Produtos" },
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/5-banner-natuoz.png", alt: "Linha Natuoz" },
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/6-banner-venda-natuoz.png", alt: "Venda Natuoz" },
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/7-banner-perfumes.png", alt: "Perfumaria" },
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/8-banner-venda-perfumes.png", alt: "Venda Perfumes" },
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/9-banner-linha-capilar.png", alt: "Linha Capilar" },
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/16-banner-planos-chip.png", alt: "Planos Chip" },
      { imageUrl: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/20-banner-atl-onmed.png", alt: "ATL ON MED" },
    ],
  },
  values: {
    title: "Quanto você pode ganhar",
    subtitle: "Estimativas com base nos resultados dos nossos consultores(as).",
    items: [
      { icon: "🌱", title: "Iniciante", description: "Vendendo nas horas livres, no WhatsApp e redes sociais.", value: "R$ 1.500/mês" },
      { icon: "🚀", title: "Dedicado", description: "Algumas horas por dia, com catálogo e divulgação ativa.", value: "R$ 4.000/mês" },
      { icon: "👑", title: "Profissional", description: "Full-time, com equipe e estratégia de tráfego.", value: "R$ 10.000+/mês" },
    ],
  },
  kits: {
    title: "Escolha como começar",
    subtitle: "Três caminhos para fazer parte do ecossistema",
    items: [
      {
        name: "Consultor(a) de Produtos",
        price: "R$ 79,90",
        description: "Comece revendendo mais de 300 produtos com até 100% de lucro",
        image:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/10-banner-kit-livre.png",
        highlights: [
          "Acesso ao catálogo completo",
          "Loja online personalizada",
          "Suporte do consultor(a)",
          "Sem mensalidade",
        ],
      },
      {
        name: "Licença ATL Services",
        price: "R$ 999,99",
        description: "Acesso completo ao ecossistema de produtos E serviços digitais",
        image:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/images/22-banner-licenca-servicos-2.png",
        highlights: [
          "Inclui licença de produtos",
          "ATL ON MED + ATL NEX + Energia",
          "ATL APPs",
          "Comissões recorrentes mensais",
        ],
      },
      {
        name: "Apenas consumir produtos",
        price: "Consulte valores",
        description: "Compre produtos de alta qualidade com desconto para uso pessoal",
        image:
          "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/catalogo-3.png",
        highlights: [
          "Mais de 300 produtos",
          "Preço de consultor(a)",
          "Sem compromisso de revenda",
        ],
        catalogUrl: "/catalogo",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes",
    subtitle: "Tudo que você precisa saber antes de começar.",
    items: [
      {
        question: "Quanto tempo leva para começar a vender?",
        answer: "Você já pode começar a vender a partir do momento do cadastro.",
      },
      {
        question: "Existe mensalidade ou taxa?",
        answer:
          "Para fazer suas vendas não existe mínimo de meta. Para ganhar bônus de formação de equipe é necessário estar ativo no mês com um pedido de pelo menos 50 pontos (equivalente a R$ 150 reais).",
      },
    ],
  },
  footer: {
    description: "Faça parte do maior ecossistema de vendas diretas do Brasil.",
    columns: [
      {
        title: "Institucional",
        links: [
          { label: "Sobre nós", href: "#" },
          { label: "Política de privacidade", href: "#" },
          { label: "Termos de uso", href: "#" },
        ],
      },
      {
        title: "Para consultores(as)",
        links: [
          { label: "Como funciona", href: "#" },
          { label: "Kits disponíveis", href: "#" },
          { label: "Treinamentos", href: "#" },
        ],
      },
    ],
    contact: {
      whatsappLabel: "Fale conosco no WhatsApp",
      email: "contato@atlanticanatural.com.br",
      hours: "Seg a Sex, 9h às 18h",
    },
    paymentMethods: ["Pix", "Visa", "Mastercard", "Boleto", "Elo"],
    copyright: "© 2026 Consultora Atlântica Natural. Todos os direitos reservados.",
  },
};
