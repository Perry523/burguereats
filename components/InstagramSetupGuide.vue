<template>
  <div class="corporate-elevated-card">
    <h3 class="title-card mb-4">🚀 Configuração do Instagram</h3>
    
    <div class="space-y-6">
      <!-- Step 1 -->
      <div class="border-l-4 border-orange-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">1. Criar App no Facebook Developers</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Acesse o Facebook Developers e crie um novo app para integração com Instagram.
        </p>
        <a 
          href="https://developers.facebook.com/apps/" 
          target="_blank" 
          class="corporate-button-primary inline-flex items-center space-x-2"
        >
          <span>🔗 Ir para Facebook Developers</span>
        </a>
      </div>

      <!-- Step 2 -->
      <div class="border-l-4 border-orange-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">2. Configurar Instagram Basic Display</h4>
        <p class="text-sm text-base-content/70 mb-3">
          No seu app, adicione o produto "Instagram Basic Display" e configure:
        </p>
        <ul class="text-sm text-base-content/70 space-y-1 mb-3">
          <li>• <strong>Valid OAuth Redirect URIs:</strong> {{ redirectUri }}</li>
          <li>• <strong>Deauthorize Callback URL:</strong> {{ redirectUri.replace('/callback', '/deauthorize') }}</li>
          <li>• <strong>Data Deletion Request URL:</strong> {{ redirectUri.replace('/callback', '/data-deletion') }}</li>
        </ul>
      </div>

      <!-- Step 3 -->
      <div class="border-l-4 border-orange-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">3. Obter Credenciais</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Copie o Instagram App ID e Instagram App Secret do seu app.
        </p>
      </div>

      <!-- Step 4 -->
      <div class="border-l-4 border-orange-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">4. Configurar Arquivo .env</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Adicione as credenciais no arquivo <code class="bg-base-300 px-1 rounded">.env</code> na pasta <code class="bg-base-300 px-1 rounded">dash/</code>:
        </p>
        <div class="bg-base-300 p-4 rounded-lg font-mono text-sm">
          <div class="text-base-content/70"># Instagram Integration</div>
          <div class="text-orange-600">INSTAGRAM_APP_ID</div>=<span class="text-green-600">seu_app_id_aqui</span><br>
          <div class="text-orange-600">INSTAGRAM_APP_SECRET</div>=<span class="text-green-600">seu_app_secret_aqui</span><br>
          <div class="text-orange-600">INSTAGRAM_REDIRECT_URI</div>=<span class="text-green-600">{{ redirectUri }}</span>
        </div>
      </div>

      <!-- Step 5 -->
      <div class="border-l-4 border-orange-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">5. Reiniciar Servidor</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Após configurar o .env, reinicie o servidor de desenvolvimento:
        </p>
        <div class="bg-base-300 p-3 rounded-lg font-mono text-sm">
          <span class="text-base-content/70">$</span> <span class="text-blue-600">yarn dev</span>
        </div>
      </div>

      <!-- Test Connection -->
      <div class="border-l-4 border-green-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">6. Testar Conexão</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Após a configuração, você poderá conectar sua conta do Instagram.
        </p>
        <div class="flex items-center space-x-2">
          <button 
            @click="checkConfiguration" 
            :disabled="checking"
            class="corporate-button-secondary"
          >
            <span v-if="checking" class="loading loading-spinner loading-sm"></span>
            {{ checking ? 'Verificando...' : '🔄 Verificar Configuração' }}
          </button>
          <span v-if="configStatus" :class="configStatus.color" class="text-sm">
            {{ configStatus.message }}
          </span>
        </div>
      </div>

      <!-- Additional Resources -->
      <div class="bg-info/10 p-4 rounded-lg">
        <h4 class="font-semibold text-info mb-2">📚 Recursos Adicionais</h4>
        <div class="space-y-2 text-sm">
          <a 
            href="https://developers.facebook.com/docs/instagram-basic-display-api/getting-started" 
            target="_blank" 
            class="link link-info block"
          >
            📖 Documentação Oficial do Instagram Basic Display API
          </a>
          <a 
            href="https://developers.facebook.com/docs/instagram-basic-display-api/overview" 
            target="_blank" 
            class="link link-info block"
          >
            🔍 Visão Geral da API
          </a>
          <a 
            href="https://developers.facebook.com/docs/instagram-basic-display-api/reference" 
            target="_blank" 
            class="link link-info block"
          >
            📋 Referência da API
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "vue-toast-notification";

const toast = useToast();
const runtimeConfig = useRuntimeConfig();

// State
const checking = ref(false);
const configStatus = ref<{ message: string; color: string } | null>(null);

// Computed
const redirectUri = computed(() => {
  if (process.client && window.location) {
    return `${window.location.origin}/auth/instagram/callback`;
  }
  return 'http://localhost:3000/auth/instagram/callback';
});

// Methods
const checkConfiguration = async () => {
  checking.value = true;
  configStatus.value = null;
  
  try {
    // Check if environment variables are set
    const appId = runtimeConfig.public.INSTAGRAM_APP_ID;
    const appSecret = runtimeConfig.public.INSTAGRAM_APP_SECRET;
    
    if (!appId || appId === 'your_instagram_app_id_here') {
      configStatus.value = {
        message: '❌ INSTAGRAM_APP_ID não configurado',
        color: 'text-error'
      };
      return;
    }
    
    if (!appSecret || appSecret === 'your_instagram_app_secret_here') {
      configStatus.value = {
        message: '❌ INSTAGRAM_APP_SECRET não configurado',
        color: 'text-error'
      };
      return;
    }
    
    configStatus.value = {
      message: '✅ Configuração válida! Reinicie o servidor.',
      color: 'text-success'
    };
    
    toast.success('Configuração válida! Reinicie o servidor para aplicar as mudanças.');
    
  } catch (error) {
    console.error('Error checking configuration:', error);
    configStatus.value = {
      message: '❌ Erro ao verificar configuração',
      color: 'text-error'
    };
  } finally {
    checking.value = false;
  }
};
</script>
