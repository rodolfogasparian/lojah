type Benefit = { icon?: string; title: string; description: string };
type Differential = { icon?: string; title: string; description: string };
type Testimonial = { videoUrl: string; name?: string; role?: string; thumbnail?: string };
type Product = { image: string; name?: string };
type ValueCard = { title: string; description: string; value?: string; icon?: string };
type Kit = {
  name: string;
  image: string;
  price: string;
  oldPrice?: string;
  highlights: string[];
  whatsappMessage?: string;
  badge?: string;
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
    "Olá! Quero ser representante e receber mais informações sobre os kits.",
  brand: { name: "Vida Natural", logoUrl: "" },
  topBar: {
    text: "Vagas abertas para representantes em todo o Brasil",
    region: "Atendimento nacional",
  },
  hero: {
    badge: "Renda extra com produtos naturais",
    title: "Seja representante e fature de",
    highlight: "casa com produtos naturais",
    subtitle:
      "Ganhe revendendo produtos com alta demanda, loja virtual pronta, catálogo digital e suporte completo. Comece com baixo investimento.",
    imageUrl:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
    ctaLabel: "Quero ser representante agora",
    bullets: [
      "Lucro de até 150% na revenda",
      "Loja virtual + catálogo prontos",
      "Suporte e treinamentos inclusos",
    ],
  },
  benefits: {
    title: "Tudo o que você recebe",
    subtitle: "Um negócio completo, pronto para começar hoje mesmo.",
    items: [
      { icon: "💰", title: "Lucro na revenda", description: "Margens generosas com produtos de altíssima procura." },
      { icon: "🛒", title: "Loja virtual pronta", description: "Sua loja online configurada para vender 24h por dia." },
      { icon: "📱", title: "Catálogo digital", description: "Compartilhe seus produtos no WhatsApp em 1 clique." },
      { icon: "🎨", title: "Material de divulgação", description: "Artes prontas para Instagram, WhatsApp e Stories." },
      { icon: "🚀", title: "Baixo investimento", description: "Comece pequeno e escale conforme suas vendas." },
      { icon: "🤝", title: "Suporte e treinamentos", description: "Mentorias semanais e equipe sempre pronta para ajudar." },
    ],
  },
  differentials: {
    title: "Por que escolher a gente",
    subtitle: "Mais que produtos, um negócio digital completo.",
    items: [
      { icon: "✅", title: "Produtos naturais certificados", description: "Linhas exclusivas com qualidade comprovada." },
      { icon: "⚡", title: "Entrega rápida", description: "Logística ágil para você nunca perder uma venda." },
      { icon: "📈", title: "Marca em crescimento", description: "Mercado bilionário e em alta no Brasil." },
      { icon: "🏆", title: "Comunidade ativa", description: "Mais de 5.000 representantes em todo o país." },
    ],
  },
  testimonials: {
    title: "Histórias reais de quem já começou",
    subtitle: "Veja o que nossos representantes estão conquistando.",
    items: [
      { videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", name: "Mariana S.", role: "Representante há 8 meses" },
      { videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", name: "Carlos M.", role: "Representante há 1 ano" },
      { videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", name: "Juliana R.", role: "Representante há 6 meses" },
    ],
  },
  gallery: {
    title: "Conheça alguns produtos",
    subtitle: "Linhas naturais que vendem sozinhas.",
    items: [
      { image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80", name: "Óleo essencial" },
      { image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=600&q=80", name: "Suplemento natural" },
      { image: "https://images.unsplash.com/photo-1612540139150-4e7fc6e7b9b3?auto=format&fit=crop&w=600&q=80", name: "Chá funcional" },
      { image: "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?auto=format&fit=crop&w=600&q=80", name: "Cosmético natural" },
      { image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80", name: "Linha skincare" },
      { image: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?auto=format&fit=crop&w=600&q=80", name: "Aromaterapia" },
    ],
  },
  values: {
    title: "Quanto você pode ganhar",
    subtitle: "Estimativas com base nos resultados dos nossos representantes.",
    items: [
      { icon: "🌱", title: "Iniciante", description: "Vendendo nas horas livres, no WhatsApp e redes sociais.", value: "R$ 1.500/mês" },
      { icon: "🚀", title: "Dedicado", description: "Algumas horas por dia, com catálogo e divulgação ativa.", value: "R$ 4.000/mês" },
      { icon: "👑", title: "Profissional", description: "Full-time, com equipe e estratégia de tráfego.", value: "R$ 10.000+/mês" },
    ],
  },
  kits: {
    title: "Escolha seu kit inicial",
    subtitle: "Comece hoje com o kit perfeito para o seu momento.",
    items: [
      {
        name: "Kit Iniciante",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=700&q=80",
        price: "R$ 297",
        oldPrice: "R$ 497",
        badge: "Mais acessível",
        highlights: ["10 produtos best-sellers", "Catálogo digital", "Acesso ao grupo VIP"],
        whatsappMessage: "Olá! Quero o Kit Iniciante, pode me ajudar?",
      },
      {
        name: "Kit Premium",
        image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?auto=format&fit=crop&w=700&q=80",
        price: "R$ 597",
        oldPrice: "R$ 997",
        badge: "Mais vendido",
        highlights: ["25 produtos variados", "Loja virtual personalizada", "Material de divulgação", "Treinamento exclusivo"],
        whatsappMessage: "Olá! Quero o Kit Premium, pode me ajudar?",
      },
      {
        name: "Kit Master",
        image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=700&q=80",
        price: "R$ 997",
        oldPrice: "R$ 1.797",
        badge: "Maior margem",
        highlights: ["50+ produtos premium", "Loja virtual + catálogo", "Mentoria individual", "Prioridade na logística"],
        whatsappMessage: "Olá! Quero o Kit Master, pode me ajudar?",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes",
    subtitle: "Tudo que você precisa saber antes de começar.",
    items: [
      { question: "Preciso ter experiência com vendas?", answer: "Não. Te ensinamos do zero, com treinamentos práticos e suporte direto pelo WhatsApp." },
      { question: "Quanto tempo leva para começar a vender?", answer: "Em até 7 dias após receber seu kit você já pode estar realizando suas primeiras vendas." },
      { question: "Existe mensalidade ou taxa?", answer: "Não cobramos mensalidade. Você investe apenas no seu kit inicial." },
      { question: "Posso revender online e fisicamente?", answer: "Sim! Você pode vender presencialmente, no WhatsApp, redes sociais e pela sua loja virtual." },
      { question: "Como funciona o envio dos produtos?", answer: "Você pode trabalhar com estoque próprio ou solicitar envios sob demanda diretamente para o cliente." },
    ],
  },
  footer: {
    description: "Vida Natural — oportunidade real para quem quer empreender com produtos naturais.",
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
        title: "Para representantes",
        links: [
          { label: "Como funciona", href: "#" },
          { label: "Kits disponíveis", href: "#" },
          { label: "Treinamentos", href: "#" },
        ],
      },
    ],
    contact: {
      whatsappLabel: "Fale conosco no WhatsApp",
      email: "contato@vidanatural.com.br",
      hours: "Seg a Sex, 9h às 18h",
    },
    paymentMethods: ["Pix", "Visa", "Mastercard", "Boleto", "Elo"],
    copyright: "© 2026 Vida Natural. Todos os direitos reservados.",
  },
};
