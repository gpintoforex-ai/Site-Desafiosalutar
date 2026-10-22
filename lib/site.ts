// Dados da empresa centralizados para utilização nas páginas do site.
export const SITE = {
  name: 'Ervanária Desafio Salutar',
  shortName: 'Desafio Salutar',
  foundingYear: 2013,
  tagline: 'Espaço dedicado à sua saúde e bem-estar em Pombal. Produtos naturais e suplementação, com aconselhamento em medicina integrativa.',
  legalName: 'Desafiosalutar – Unipessoal, Lda.',
  address: 'Rua Professor Ernesto Domingues Tavares, 26',
  postalCode: '3100-478',
  city: 'Pombal',
  fullAddress: 'Rua Professor Ernesto Domingues Tavares, 26, 3100-478 Pombal',
  phone: '+351 236 023 218',
  phoneHref: 'tel:+351236023218',
  phoneCostNote: 'Chamada para a rede fixa nacional',
  mobilePhone: '+351 910 419 820',
  mobilePhoneHref: 'tel:+351910419820',
  whatsappUrl: `https://wa.me/351910419820?text=${encodeURIComponent('Olá! Gostaria de obter mais informações sobre os produtos da Desafio Salutar.')}`,
  adviceWhatsappUrl: `https://wa.me/351910419820?text=${encodeURIComponent('Olá! Gostaria de obter informações gerais ou combinar um contacto com a Desafio Salutar.')}`,
  mobilePhoneCostNote: 'Chamada para a rede móvel nacional',
  email: 'desafiosalutar@hotmail.com',
  nif: '510774318',
  registry: 'Matrícula n.º 510774318',
  capital: '1 000 €',
  cae: '47272',
  facebookUrl: '#',
  instagramUrl: '#',
  mapQuery: 'Rua Professor Ernesto Domingues Tavares 26, 3100-478 Pombal',
  googleMapsUrl: 'https://maps.app.goo.gl/7BxpanTGB7oCTtEi8',
  // Snapshot supplied by the owner; update these values when the Google rating changes.
  googleRating: { score: 4.9, count: 33, checkedAt: '2026-10-09' },
  hours: [
    { days: 'Segunda a Sexta', time: '09h30 – 19h30' },
    { days: 'Sábado', time: '09h30 – 13h00' },
    { days: 'Domingo e feriados', time: 'Encerrado' },
  ],
  copyrightYear: 2026,
  privacyUpdated: '22 de outubro de 2026',
} as const;

export const NAV_MAIN = [
  { href: '/', label: 'Início' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/marcas', label: 'Marcas' },
  { href: '/contactos', label: 'Contactos' },
  { href: '/pedido-recomendacao', label: 'Pedido de recomendação' },
] as const;

export const NAV_LEGAL = [
  { href: '/politica-privacidade', label: 'Política de Privacidade' },
  { href: '/informacao-legal', label: 'Informação Legal' },
] as const;

export const IMAGES = {
  hero1: '/img/hero_store_interior.jpg?v=2',
  hero2: '/img/hero_counseling.jpg?v=2',
  hero3: '/img/hero_products_display.jpg?v=2',
  about: '/img/about_shop.jpg?v=2',
  contact: '/img/contact_storefront.jpg?v=2',
};

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  examples: string[];
  image: string;
  alt: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: 'chas-e-infusoes',
    name: 'Chás e Infusões',
    short: 'Chás e infusões selecionados para momentos de calma, digestão e bem-estar.',
    description:
      'Uma seleção cuidada de chás e infusões, simples ou em misturas, pensadas para acompanhar o seu dia-a-dia — do despertar ao descanso. Aconselhamos a infusão mais indicada para cada momento.',
    examples: ['Camomila, tília e erva-cidreira', 'Misturas digestivas', 'Chás verdes e brancos', 'Infusões para o descanso'],
    image: '/img/cat_chas.jpg?v=1',
    alt: 'Chávena de infusão de ervas com caixas de chá',
  },
  {
    slug: 'suplementos-naturais',
    name: 'Suplementos Naturais',
    short: 'Vitaminas, minerais e complementos de origem natural.',
    description:
      'Suplementos alimentares de marcas de referência, com vitaminas, minerais, probióticos e extratos vegetais. Os suplementos alimentares não substituem um regime alimentar variado e equilibrado nem um modo de vida saudável.',
    examples: ['Vitaminas e minerais', 'Probióticos', 'Ómega 3', 'Complementos para articulações'],
    image: '/img/cat_suplementos.jpg?v=1',
    alt: 'Frascos de suplementos naturais e cápsulas junto a folhas verdes',
  },
  {
    slug: 'fitoterapia',
    name: 'Fitoterapia',
    short: 'Produtos de origem vegetal em formatos práticos.',
    description:
      'Extratos, tinturas e cápsulas de origem vegetal, que reúnem o conhecimento tradicional da fitoterapia com padrões de qualidade actuais. A nossa equipa ajuda a escolher com responsabilidade.',
    examples: ['Tinturas e extratos', 'Cápsulas de origem vegetal', 'Xaropes naturais'],
    image: '/img/cat_fitoterapia.jpg?v=1',
    alt: 'Frascos conta-gotas âmbar com extratos naturais',
  },
  {
    slug: 'oleos-essenciais',
    name: 'Óleos Essenciais',
    short: 'Aromaterapia pura para o corpo, a mente e o ambiente.',
    description:
      'Óleos essenciais e óleos vegetais para aromaterapia, massagem e ambiente. Informamos sobre a utilização segura de cada óleo, incluindo diluições e precauções.',
    examples: ['Lavanda, eucalipto e melaleuca', 'Óleos vegetais de base', 'Sinergias aromáticas', 'Difusores'],
    image: '/img/cat_oleos.jpg?v=1',
    alt: 'Frascos de óleos essenciais com lavanda, eucalipto e ervas aromáticas',
  },
  {
    slug: 'cosmeticos-naturais',
    name: 'Cosméticos Naturais',
    short: 'Cuidados de pele e cabelo com ingredientes de origem vegetal.',
    description:
      'Cosmética natural e certificada para rosto, corpo e cabelo, formulada com ingredientes de origem vegetal e respeito pela pele sensível.',
    examples: ['Cremes de rosto e corpo', 'Sabonetes naturais', 'Champôs sólidos e líquidos', 'Protetores labiais'],
    image: '/img/cat_cosmeticos.jpg?v=1',
    alt: 'Cosméticos naturais, sabonete e sérum dispostos com elementos botânicos',
  },
  {
    slug: 'mel-e-derivados',
    name: 'Mel e Derivados',
    short: 'Mel, própolis, pólen e geleia real — o melhor da colmeia.',
    description:
      'Mel de diferentes floradas e produtos da colmeia, como própolis, pólen e geleia real, selecionados pela sua qualidade e origem.',
    examples: ['Mel de várias floradas', 'Própolis', 'Pólen', 'Geleia real'],
    image: '/img/cat_mel.jpg?v=1',
    alt: 'Frasco de mel com favo, própolis e pólen e colher de madeira',
  },
];

export type Brand = { name: string; origin?: string; focus: string; description: string; logo: string };

export const BRANDS: Brand[] = [
  { name: 'NovoHorizonte', focus: 'Produtos naturais', description: 'Conheça as referências NovoHorizonte disponíveis na loja e peça aconselhamento à nossa equipa.', logo: '/marcas/novo-horizonte.png' },
  { name: 'PhytoGold', focus: 'Produtos naturais', description: 'Conheça a seleção PhytoGold disponível na nossa loja e peça aconselhamento à equipa.', logo: '/marcas/phytogold.png' },
  { name: 'Sovex', focus: 'Produtos naturais', description: 'Consulte as referências Sovex disponíveis na Desafio Salutar. Contacte-nos para saber mais.', logo: '/marcas/sovex.png' },
  { name: 'Fharmonat', focus: 'Suplementação', description: 'Descubra os produtos Fharmonat disponíveis e esclareça as suas dúvidas com a nossa equipa.', logo: '/marcas/fharmonat.png' },
  { name: 'NOW', focus: 'Suplementação', description: 'Encontre referências NOW na loja, com orientação para a sua escolha. A disponibilidade pode variar.', logo: '/marcas/now.png' },
  { name: 'Natiris', focus: 'Suplementação', description: 'Peça informações sobre a seleção Natiris disponível na Desafio Salutar.', logo: '/marcas/natiris.png' },
  { name: 'Organic India', focus: 'Produtos naturais', description: 'Conheça as referências Organic India disponíveis na loja e peça aconselhamento personalizado.', logo: '/marcas/organic-india.png' },
  { name: 'Activ Ozone', focus: 'Produtos naturais', description: 'Conheça os produtos Activ Ozone disponíveis na loja. A nossa equipa ajuda a esclarecer as suas dúvidas.', logo: '/marcas/activ-ozone.png' },
  { name: 'Bio-Kult', focus: 'Suplementação', description: 'Consulte a nossa seleção Bio-Kult e peça aconselhamento sobre os produtos disponíveis.', logo: '/marcas/bio-kult.png' },
  { name: 'Bioceutica', focus: 'Produtos naturais', description: 'Encontre referências Bioceutica na Desafio Salutar. Contacte-nos para conhecer a disponibilidade.', logo: '/marcas/bioceutica.png' },
  { name: 'BioSamara', focus: 'Produtos naturais', description: 'Descubra a seleção BioSamara na nossa loja, com aconselhamento próximo para a sua escolha.', logo: '/marcas/biosamara.png' },
  { name: 'CHI', focus: 'Suplementação', description: 'Conheça as referências CHI disponíveis e esclareça as suas dúvidas com a nossa equipa.', logo: '/marcas/chi.png' },
  { name: 'Drasanvi', focus: 'Suplementação', description: 'Peça informações sobre a gama Drasanvi disponível na loja e encontre orientação para a sua escolha.', logo: '/marcas/drasanvi.png' },
  { name: 'Nutridil', focus: 'Produtos naturais', description: 'Consulte os produtos Nutridil disponíveis na Desafio Salutar. A disponibilidade pode variar.', logo: '/marcas/nutridil.png' },
  { name: 'Dietmed', origin: 'Portugal', focus: 'Produtos naturais', description: 'Desde 1987, referência portuguesa em produtos naturais, suplementos alimentares e fitoterapia.', logo: '/marcas/dietmed.png' },
  { name: 'Niral', origin: 'Portugal', focus: 'Suplementos alimentares', description: 'Marca portuguesa especializada em suplementos alimentares e produtos de saúde natural.', logo: '/marcas/niral.png' },
  { name: 'Nasófis', origin: 'Portugal', focus: 'Bem-estar natural', description: 'Dedicada ao bem-estar natural, com uma gama de produtos focada na saúde e equilíbrio.', logo: '/marcas/nasofis.png' },
  { name: 'JustNat', origin: 'Portugal', focus: 'Produtos naturais', description: 'Marca de produtos naturais que promove um estilo de vida saudável e sustentável.', logo: '/marcas/justnat.png' },
  { name: 'Próvida', origin: 'Portugal', focus: 'Produtos naturais', description: 'Produtos naturais de qualidade, com foco na saúde, bem-estar e suplementação alimentar.', logo: '/marcas/provida.png' },
  { name: 'Nutergia', origin: 'França', focus: 'Micronutrição', description: 'Laboratório francês especializado em micronutrição celular e suplementos alimentares desde 1989.', logo: '/marcas/nutergia.png' },
];
