<template>
  <div class="corporate-elevated-card">
    <h3 class="title-card mb-4">🚀 Configuração do Facebook</h3>
    
    <div class="space-y-6">
      <!-- Step 1 -->
      <div class="border-l-4 border-blue-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">1. Criar App no Facebook Developers</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Acesse o Facebook Developers e crie um novo app para integração com Facebook.
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
      <div class="border-l-4 border-blue-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">2. Configurar Facebook Login</h4>
        <p class="text-sm text-base-content/70 mb-3">
          No seu app, adicione o produto "Facebook Login" e configure:
        </p>
        <ul class="text-sm text-base-content/70 space-y-1 mb-3">
          <li>• <strong>Valid OAuth Redirect URIs:</strong> {{ redirectUri }}</li>
          <li>• <strong>Deauthorize Callback URL:</strong> {{ redirectUri.replace('/callback', '/deauthorize') }}</li>
          <li>• <strong>Data Deletion Request URL:</strong> {{ redirectUri.replace('/callback', '/data-deletion') }}</li>
        </ul>
      </div>

      <!-- Step 3 -->
      <div class="border-l-4 border-blue-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">3. Adicionar Permissões</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Configure as seguintes permissões no App Review:
        </p>
        <ul class="text-sm text-base-content/70 space-y-1 mb-3">
          <li>• <strong>email</strong> - Acesso ao email do usuário</li>
          <li>• <strong>pages_show_list</strong> - Listar páginas administradas</li>
          <li>• <strong>pages_read_engagement</strong> - Ler métricas das páginas</li>
          <li>• <strong>pages_manage_posts</strong> - Gerenciar posts das páginas</li>
        </ul>
      </div>

      <!-- Step 4 -->
      <div class="border-l-4 border-blue-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">4. Obter Credenciais</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Copie o App ID e App Secret do seu app.
        </p>
      </div>

      <!-- Step 5 -->
      <div class="border-l-4 border-blue-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">5. Configurar Arquivo .env</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Adicione as credenciais no arquivo <code class="bg-base-300 px-1 rounded">.env</code> na pasta <code class="bg-base-300 px-1 rounded">dash/</code>:
        </p>
        <div class="bg-base-300 p-4 rounded-lg font-mono text-sm">
          <div class="text-base-content/70"># Facebook Integration</div>
          <div class="text-blue-600">FACEBOOK_APP_ID</div>=<span class="text-green-600">seu_app_id_aqui</span><br>
          <div class="text-blue-600">FACEBOOK_APP_SECRET</div>=<span class="text-green-600">seu_app_secret_aqui</span><br>
          <div class="text-blue-600">FACEBOOK_REDIRECT_URI</div>=<span class="text-green-600">{{ redirectUri }}</span>
        </div>
      </div>

      <!-- Step 6 -->
      <div class="border-l-4 border-blue-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">6. Reiniciar Servidor</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Após configurar o .env, reinicie o servidor de desenvolvimento:
        </p>
        <div class="bg-base-300 p-3 rounded-lg font-mono text-sm">
          <span class="text-base-content/70">$</span> <span class="text-blue-600">yarn dev</span>
        </div>
      </div>

      <!-- Test Connection -->
      <div class="border-l-4 border-green-500 pl-4">
        <h4 class="font-semibold text-base-content mb-2">7. Testar Conexão</h4>
        <p class="text-sm text-base-content/70 mb-3">
          Após a configuração, você poderá conectar sua conta do Facebook.
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

      <!-- Development Mode -->
      <div class="bg-warning/10 p-4 rounded-lg">
        <h4 class="font-semibold text-warning mb-2">⚠️ Modo de Desenvolvimento</h4>
        <div class="space-y-2 text-sm">
          <p class="text-base-content/70">
            Durante o desenvolvimento, adicione usuários de teste no Facebook App:
          </p>
          <ol class="list-decimal list-inside space-y-1 text-base-content/70">
            <li>Vá para App → Roles → Test Users</li>
            <li>Adicione usuários de teste ou use sua própria conta</li>
            <li>Para produção, submeta o app para revisão do Facebook</li>
          </ol>
        </div>
      </div>

      <!-- Additional Resources -->
      <div class="bg-info/10 p-4 rounded-lg">
        <h4 class="font-semibold text-info mb-2">📚 Recursos Adicionais</h4>
        <div class="space-y-2 text-sm">
          <a 
            href="https://developers.facebook.com/docs/facebook-login/web" 
            target="_blank" 
            class="link link-info block"
          >
            📖 Documentação do Facebook Login
          </a>
          <a 
            href="https://developers.facebook.com/docs/pages-api" 
            target="_blank" 
            class="link link-info block"
          >
            🔍 API de Páginas do Facebook
          </a>
          <a 
            href="https://developers.facebook.com/docs/graph-api" 
            target="_blank" 
            class="link link-info block"
          >
            📋 Graph API Reference
          </a>
          <a 
            href="https://developers.facebook.com/docs/app-review" 
            target="_blank" 
            class="link link-info block"
          >
            ✅ Processo de Revisão do App
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
    return `${window.location.origin}/auth/facebook/callback`;
  }
  return 'http://localhost:3000/auth/facebook/callback';
});

// Methods
const checkConfiguration = async () => {
  checking.value = true;
  configStatus.value = null;
  
  try {
    // Check if environment variables are set
    const appId = runtimeConfig.public.FACEBOOK_APP_ID;
    const appSecret = runtimeConfig.public.FACEBOOK_APP_SECRET;
    
    if (!appId || appId === 'your_facebook_app_id_here') {
      configStatus.value = {
        message: '❌ FACEBOOK_APP_ID não configurado',
        color: 'text-error'
      };
      return;
    }
    
    if (!appSecret || appSecret === 'your_facebook_app_secret_here') {
      configStatus.value = {
        message: '❌ FACEBOOK_APP_SECRET não configurado',
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
