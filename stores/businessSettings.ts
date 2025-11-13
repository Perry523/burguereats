import { defineStore } from 'pinia';

export interface BusinessModule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  category: 'core' | 'optional';
}

export interface BusinessSettings {
  // Core settings
  businessName: string;
  businessType: string;
  businessCategory: string;
  
  // Instagram integration
  instagramConnected: boolean;
  instagramUsername: string;
  instagramAccessToken: string;
  instagramUserId: string;

  // Facebook integration
  facebookConnected: boolean;
  facebookUserName: string;
  facebookUserId: string;
  facebookAccessToken: string;
  facebookPages: Array<{
    id: string;
    name: string;
    accessToken: string;
    category: string;
  }>;
  
  // AI settings
  aiEnabled: boolean;
  geminiApiKey: string;
  defaultTone: string;
  
  // Module configurations
  modules: BusinessModule[];
  
  // Scheduling settings (when enabled)
  schedulingSettings: {
    enabled: boolean;
    allowOnlineBooking: boolean;
    requireApproval: boolean;
    advanceBookingDays: number;
    workingHours: {
      [key: string]: {
        enabled: boolean;
        start: string;
        end: string;
        breaks: Array<{ start: string; end: string }>;
      };
    };
    services: Array<{
      id: string;
      name: string;
      duration: number;
      price: number;
      description: string;
    }>;
  };
  
  // Product management settings (when enabled)
  productSettings: {
    enabled: boolean;
    trackInventory: boolean;
    lowStockAlert: number;
    categories: string[];
    taxRate: number;
  };
}

export const useBusinessSettingsStore = defineStore('businessSettings', {
  state: (): BusinessSettings => ({
    // Core settings
    businessName: 'Meu Negócio',
    businessType: 'retail',
    businessCategory: 'general',
    
    // Instagram integration
    instagramConnected: false,
    instagramUsername: '',
    instagramAccessToken: '',
    instagramUserId: '',

    // Facebook integration
    facebookConnected: false,
    facebookUserName: '',
    facebookUserId: '',
    facebookAccessToken: '',
    facebookPages: [],
    
    // AI settings
    aiEnabled: true,
    geminiApiKey: '',
    defaultTone: 'friendly',
    
    // Module configurations
    modules: [
      {
        id: 'instagram',
        name: 'Instagram Integration',
        description: 'Connect and manage your Instagram business account',
        enabled: true,
        icon: 'camera',
        category: 'core',
      },
      {
        id: 'ai_content',
        name: 'AI Content Generation',
        description: 'Generate posts and content using AI',
        enabled: true,
        icon: 'sparkles',
        category: 'core',
      },
      {
        id: 'scheduling',
        name: 'Appointment Scheduling',
        description: 'Manage appointments and bookings',
        enabled: false,
        icon: 'calendar',
        category: 'optional',
      },
      {
        id: 'products',
        name: 'Product Management',
        description: 'Manage inventory and product catalog',
        enabled: false,
        icon: 'shopping-bag',
        category: 'optional',
      },
      {
        id: 'analytics',
        name: 'Advanced Analytics',
        description: 'Detailed business and social media analytics',
        enabled: true,
        icon: 'chart-bar',
        category: 'core',
      },
    ],
    
    // Scheduling settings
    schedulingSettings: {
      enabled: false,
      allowOnlineBooking: true,
      requireApproval: false,
      advanceBookingDays: 30,
      workingHours: {
        monday: { enabled: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        tuesday: { enabled: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        wednesday: { enabled: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        thursday: { enabled: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        friday: { enabled: true, start: '09:00', end: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
        saturday: { enabled: false, start: '09:00', end: '17:00', breaks: [] },
        sunday: { enabled: false, start: '09:00', end: '17:00', breaks: [] },
      },
      services: [],
    },
    
    // Product settings
    productSettings: {
      enabled: false,
      trackInventory: true,
      lowStockAlert: 10,
      categories: ['Geral'],
      taxRate: 0,
    },
  }),

  getters: {
    enabledModules: (state) => state.modules.filter(module => module.enabled),
    
    coreModules: (state) => state.modules.filter(module => module.category === 'core'),
    
    optionalModules: (state) => state.modules.filter(module => module.category === 'optional'),
    
    isModuleEnabled: (state) => (moduleId: string) => {
      const module = state.modules.find(m => m.id === moduleId);
      return module?.enabled || false;
    },
    
    isSchedulingEnabled: (state) => {
      return state.modules.find(m => m.id === 'scheduling')?.enabled || false;
    },
    
    isProductsEnabled: (state) => {
      return state.modules.find(m => m.id === 'products')?.enabled || false;
    },
    
    businessTypeLabel: (state) => {
      const types = {
        restaurant: 'Restaurante',
        retail: 'Varejo',
        services: 'Serviços',
        beauty: 'Beleza & Estética',
        fitness: 'Fitness & Saúde',
        technology: 'Tecnologia',
        education: 'Educação',
        other: 'Outro',
      };
      return types[state.businessType as keyof typeof types] || 'Não definido';
    },
  },

  actions: {
    toggleModule(moduleId: string) {
      const module = this.modules.find(m => m.id === moduleId);
      if (module) {
        module.enabled = !module.enabled;
        
        // Update related settings when toggling modules
        if (moduleId === 'scheduling') {
          this.schedulingSettings.enabled = module.enabled;
        } else if (moduleId === 'products') {
          this.productSettings.enabled = module.enabled;
        }
      }
    },
    
    updateBusinessInfo(info: Partial<BusinessSettings>) {
      Object.assign(this, info);
    },
    
    updateInstagramSettings(settings: {
      connected: boolean;
      username?: string;
      accessToken?: string;
      userId?: string;
    }) {
      this.instagramConnected = settings.connected;
      if (settings.username) this.instagramUsername = settings.username;
      if (settings.accessToken) this.instagramAccessToken = settings.accessToken;
      if (settings.userId) this.instagramUserId = settings.userId;
    },

    updateFacebookSettings(settings: {
      connected: boolean;
      userName?: string;
      userId?: string;
      accessToken?: string;
      pages?: Array<{
        id: string;
        name: string;
        accessToken: string;
        category: string;
      }>;
    }) {
      this.facebookConnected = settings.connected;
      if (settings.userName) this.facebookUserName = settings.userName;
      if (settings.userId) this.facebookUserId = settings.userId;
      if (settings.accessToken) this.facebookAccessToken = settings.accessToken;
      if (settings.pages) this.facebookPages = settings.pages;
    },
    
    updateAISettings(settings: {
      enabled?: boolean;
      apiKey?: string;
      defaultTone?: string;
    }) {
      if (settings.enabled !== undefined) this.aiEnabled = settings.enabled;
      if (settings.apiKey) this.geminiApiKey = settings.apiKey;
      if (settings.defaultTone) this.defaultTone = settings.defaultTone;
    },
    
    updateSchedulingSettings(settings: Partial<BusinessSettings['schedulingSettings']>) {
      Object.assign(this.schedulingSettings, settings);
    },
    
    updateProductSettings(settings: Partial<BusinessSettings['productSettings']>) {
      Object.assign(this.productSettings, settings);
    },
    
    addService(service: BusinessSettings['schedulingSettings']['services'][0]) {
      this.schedulingSettings.services.push(service);
    },
    
    updateService(serviceId: string, updates: Partial<BusinessSettings['schedulingSettings']['services'][0]>) {
      const serviceIndex = this.schedulingSettings.services.findIndex(s => s.id === serviceId);
      if (serviceIndex !== -1) {
        Object.assign(this.schedulingSettings.services[serviceIndex], updates);
      }
    },
    
    removeService(serviceId: string) {
      this.schedulingSettings.services = this.schedulingSettings.services.filter(s => s.id !== serviceId);
    },
    
    getRecommendedModules() {
      const recommendations = {
        restaurant: ['scheduling', 'products'],
        retail: ['products'],
        services: ['scheduling'],
        beauty: ['scheduling'],
        fitness: ['scheduling'],
        technology: [],
        education: ['scheduling'],
        other: [],
      };
      
      return recommendations[this.businessType as keyof typeof recommendations] || [];
    },
    
    async saveSettings() {
      try {
        // TODO: Implement API call to save settings
        console.log('Saving business settings:', this.$state);
        return true;
      } catch (error) {
        console.error('Error saving business settings:', error);
        return false;
      }
    },
    
    async loadSettings() {
      try {
        // TODO: Implement API call to load settings
        console.log('Loading business settings...');
        return true;
      } catch (error) {
        console.error('Error loading business settings:', error);
        return false;
      }
    },
  },

  persist: true,
});
