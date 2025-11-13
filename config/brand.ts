// 🍅 Tomatiza - Configurações de Marca
export const brandConfig = {
  // Informações básicas da marca
  name: 'Tomatiza',
  tagline: 'Sua gestão empresarial mais saborosa',
  description: 'Plataforma completa de gestão empresarial com integração ao Instagram e Facebook, geração de conteúdo com IA e automação de redes sociais',
  
  // Logo e ícones
  logo: {
    emoji: '🍅',
    text: 'Tomatiza',
    favicon: '/favicon-tomato.ico',
    appleTouchIcon: '/apple-touch-icon-tomato.png',
    ogImage: '/Tomatiza-og-image.png'
  },
  
  // Cores da marca
  colors: {
    primary: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    tomato: {
      light: '#f87171',
      main: '#ef4444',
      dark: '#dc2626',
      darker: '#b91c1c'
    }
  },
  
  // SEO padrão
  seo: {
    defaultTitle: 'Tomatiza 🍅 | Plataforma de Gestão Empresarial',
    titleTemplate: '%s - Tomatiza 🍅',
    defaultDescription: 'Plataforma completa de gestão empresarial com integração ao Instagram e Facebook, geração de conteúdo com IA e automação de redes sociais',
    keywords: [
      'gestão empresarial',
      'redes sociais', 
      'instagram',
      'facebook',
      'automação',
      'IA',
      'conteúdo',
      'marketing digital',
      'Tomatiza',
      'dashboard',
      'analytics',
      'clientes',
      'agendamento',
      'produtos'
    ],
    author: 'Tomatiza',
    twitterHandle: '@Tomatiza',
    siteUrl: 'https://Tomatiza.com.br'
  },
  
  // Configurações de tema
  theme: {
    defaultMode: 'light',
    primaryColor: 'red',
    borderRadius: '0.5rem',
    fontFamily: 'Inter, system-ui, sans-serif'
  },
  
  // Textos da interface
  ui: {
    navigation: {
      dashboard: 'Visão Geral',
      analytics: 'Analytics',
      social: 'Redes Sociais',
      clients: 'Clientes',
      scheduling: 'Agendamentos',
      products: 'Produtos',
      finances: 'Finanças',
      administration: 'Administração',
      settings: 'Configurações'
    },
    
    actions: {
      create: 'Criar',
      edit: 'Editar',
      delete: 'Excluir',
      save: 'Salvar',
      cancel: 'Cancelar',
      connect: 'Conectar',
      disconnect: 'Desconectar',
      publish: 'Publicar',
      schedule: 'Agendar'
    },
    
    messages: {
      welcome: 'Bem-vindo ao Tomatiza! 🍅',
      loading: 'Carregando...',
      success: 'Operação realizada com sucesso!',
      error: 'Ops! Algo deu errado.',
      noData: 'Nenhum dado encontrado.',
      confirmDelete: 'Tem certeza que deseja excluir?'
    }
  },
  
  // Configurações de funcionalidades
  features: {
    socialMedia: {
      platforms: ['instagram', 'facebook'],
      aiContentGeneration: true,
      scheduling: true,
      analytics: true
    },
    
    business: {
      clientManagement: true,
      productCatalog: true,
      scheduling: true,
      financialReports: true,
      userManagement: true
    }
  },
  
  // Links importantes
  links: {
    website: 'https://Tomatiza.com.br',
    support: 'https://suporte.Tomatiza.com.br',
    documentation: 'https://docs.Tomatiza.com.br',
    privacy: 'https://Tomatiza.com.br/privacidade',
    terms: 'https://Tomatiza.com.br/termos'
  }
};

// Helper para gerar metadados SEO
export const generateSEOMeta = (page: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}) => {
  const title = page.title 
    ? `${page.title} - ${brandConfig.name} 🍅`
    : brandConfig.seo.defaultTitle;
    
  const description = page.description || brandConfig.seo.defaultDescription;
  
  const keywords = page.keywords 
    ? [...brandConfig.seo.keywords, ...page.keywords]
    : brandConfig.seo.keywords;
    
  const image = page.image || brandConfig.logo.ogImage;
  const url = page.url || brandConfig.links.website;
  
  return {
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: brandConfig.seo.author },
      
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: brandConfig.name },
      
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:site', content: brandConfig.seo.twitterHandle },
      
      // Favicon
      { name: 'theme-color', content: brandConfig.colors.tomato.main }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: brandConfig.logo.favicon },
      { rel: 'apple-touch-icon', href: brandConfig.logo.appleTouchIcon }
    ]
  };
};

// Helper para classes CSS da marca
export const brandClasses = {
  logo: 'w-8 h-8 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center shadow-lg',
  logoText: 'text-lg font-bold text-primary',
  primaryButton: 'btn btn-primary bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700',
  secondaryButton: 'btn btn-outline btn-primary border-red-600 text-red-600 hover:bg-red-600 hover:border-red-600',
  accent: 'text-red-600',
  gradient: 'bg-gradient-to-r from-red-500 to-red-400'
};

export default brandConfig;
