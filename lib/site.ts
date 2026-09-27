// Dados da empresa — valores entre [ ] são placeholders a actualizar pelo cliente.
export const SITE = {
  name: 'Ervanária Desafio Salutar',
  shortName: 'Desafio Salutar',
  foundingYear: 2013,
  tagline: 'Espaço dedicado à sua saúde e bem-estar em Pombal. 100% de origem natural, com aconselhamento personalizado.',
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
  mobilePhoneCostNote: 'Chamada para a rede móvel nacional',
  email: 'desafiosalutar@hotmail.com',
  nif: '510774318',
  registry: '[Conservatória do Registo Comercial de Pombal — a confirmar pelo cliente]',
  capital: '[Capital social — a confirmar pelo cliente]',
  cae: '[CAE — a confirmar pelo cliente]',
  facebookUrl: '#',
  instagramUrl: '#',
  mapQuery: 'Rua Professor Ernesto Domingues Tavares 26, 3100-478 Pombal',
  hours: [
    { days: 'Segunda a Sexta', time: '09h30 – 19h30' },
    { days: 'Sábado', time: '09h30 – 13h00' },
    { days: 'Domingo e feriados', time: 'Encerrado' },
  ],
  copyrightYear: 2026,
  privacyUpdated: '25 de setembro de 2026',
} as const;

export const NAV_MAIN = [
  { href: '/', label: 'Início' },
  { href: '/quem-somos', label: 'Quem Somos' },
  { href: '/produtos', label: 'Produtos' },
  { href: '/marcas', label: 'Marcas' },
  { href: '/contactos', label: 'Contactos' },
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
    short: 'Plantas selecionadas para momentos de calma, digestão e bem-estar.',
    description:
      'Uma seleção cuidada de chás e infusões de plantas, simples ou em misturas, pensadas para acompanhar o seu dia-a-dia — do despertar ao descanso. Aconselhamos a infusão mais indicada para cada momento.',
    examples: ['Camomila, tília e erva-cidreira', 'Misturas digestivas', 'Chás verdes e brancos', 'Infusões para o descanso'],
    image: '/img/cat_chas.jpg?v=1',
    alt: 'Chávena de infusão de ervas com caixas de chá e plantas secas',
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
    short: 'O saber tradicional das plantas medicinais em formatos práticos.',
    description:
      'Extratos, tinturas e cápsulas à base de plantas, que reúnem o conhecimento tradicional da fitoterapia com padrões de qualidade actuais. A nossa equipa ajuda a escolher com responsabilidade.',
    examples: ['Tinturas e extratos', 'Cápsulas de plantas', 'Xaropes naturais', 'Plantas medicinais secas'],
    image: '/img/cat_fitoterapia.jpg?v=1',
    alt: 'Frascos conta-gotas âmbar com extratos e plantas medicinais secas',
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

export type Brand = { name: string; origin: string; focus: string; description: string; logo: string };

export const BRANDS: Brand[] = [
  { name: 'Dietmed', origin: 'Portugal', focus: 'Produtos naturais', description: 'Desde 1987, referência portuguesa em produtos naturais, suplementos alimentares e fitoterapia.', logo: '/marcas/dietmed.png' },
  { name: 'Niral', origin: 'Portugal', focus: 'Suplementos alimentares', description: 'Marca portuguesa especializada em suplementos alimentares e produtos de saúde natural.', logo: '/marcas/niral.png' },
  { name: 'Nasófis', origin: 'Portugal', focus: 'Bem-estar natural', description: 'Dedicada ao bem-estar natural, com uma gama de produtos focada na saúde e equilíbrio.', logo: '/marcas/nasofis.png' },
  { name: 'JustNat', origin: 'Portugal', focus: 'Produtos naturais', description: 'Marca de produtos naturais que promove um estilo de vida saudável e sustentável.', logo: '/marcas/justnat.png' },
  { name: 'Próvida', origin: 'Portugal', focus: 'Produtos naturais', description: 'Produtos naturais de qualidade, com foco na saúde, bem-estar e suplementação alimentar.', logo: '/marcas/provida.png' },
  { name: 'Nutergia', origin: 'França', focus: 'Micronutrição', description: 'Laboratório francês especializado em micronutrição celular e suplementos alimentares desde 1989.', logo: '/marcas/nutergia.png' },
];
