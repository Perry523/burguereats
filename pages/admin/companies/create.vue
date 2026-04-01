<template>
  <div class="max-w-4xl mx-auto py-6 pb-24 px-4 sm:px-0">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Nova Empresa</h1>
        <p class="text-gray-600 mt-2">Crie uma nova conta de restaurante ou delivery no sistema</p>
      </div>
      <NuxtLink to="/admin/companies">
        <button class="btn btn-ghost btn-sm gap-2">
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Voltar
        </button>
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Nova Empresa</h2>
      
      <form @submit.prevent="submitForm" class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa <span class="text-red-500">*</span></label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ex: Burguereats"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Comercial <span class="text-red-500">*</span></label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="contato@empresa.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Negócio <span class="text-red-500">*</span></label>
          <div class="flex items-center gap-4 mt-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                v-model="form.type"
                value="restaurant"
                class="radio radio-primary radio-sm"
              />
              <span class="text-sm text-gray-700">Restaurante</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                v-model="form.type"
                value="delivery"
                class="radio radio-primary radio-sm"
              />
              <span class="text-sm text-gray-700">Delivery</span>
            </label>
          </div>
        </div>

        <div>
           <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
           <input
             v-model="form.phone"
             type="text"
             v-maska
             data-maska="(##) #####-####"
             class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
             placeholder="(00) 00000-0000"
           />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
          <input
            v-model="form.address"
            type="text"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Rua Exemplo, 123"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              v-model="form.city"
              type="text"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="São Paulo"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado (UF)</label>
            <select
              v-model="form.state"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700 bg-white"
            >
              <option value="" disabled>Selecione</option>
              <option v-for="uf in ufOptions" :key="uf.value" :value="uf.value">{{ uf.label }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">CEP</label>
             <input
               v-model="form.zipCode"
               type="text"
               v-maska
               data-maska="#####-###"
               class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
               placeholder="00000-000"
             />
          </div>
          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">iFood Merchant ID</label>
             <input
               v-model="form.ifood_merchant_id"
               type="text"
               class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
               placeholder="ID do iFood"
             />
          </div>
        </div>
      </form>
    </div>

    <!-- Manager Login Section -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-1">Gerente da Empresa</h2>
      <p class="text-sm text-gray-500 mb-4">Dados de login do gerente que será vinculado a esta empresa.</p>
      
      <div class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Gerente <span class="text-red-500">*</span></label>
          <input
            v-model="form.manager_name"
            type="text"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nome completo"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email de Login <span class="text-red-500">*</span></label>
            <input
              v-model="form.manager_email"
              type="email"
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="gerente@email.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Senha <span class="text-red-500">*</span></label>
            <input
              v-model="form.manager_password"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefone do Gerente</label>
          <input
            v-model="form.manager_phone"
            type="text"
            v-maska
            data-maska="(##) #####-####"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div class="flex items-center gap-3 pt-4">
          <NuxtLink to="/admin/companies" class="block w-full sm:w-auto">
            <button
              type="button"
              class="w-full px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 flex items-center justify-center transition-colors"
            >
              Cancelar
            </button>
          </NuxtLink>
          
          <button
            @click="submitForm"
            :disabled="loading || !form.name || !form.email || !form.manager_name || !form.manager_email || !form.manager_password"
            class="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Salvando...' : 'Criar Empresa' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: "admin",
});

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

onMounted(() => {
  if (authStore.user?.role !== 'admin') {
    router.replace('/admin');
  }
});

const ufOptions = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Tocantins', value: 'TO' }
];

const form = ref({
  name: '',
  type: 'delivery',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  manager_name: '',
  manager_email: '',
  manager_password: '',
  manager_phone: '',
  ifood_merchant_id: '',
});

const submitAttempted = ref(false);
const loading = ref(false);

const submitForm = async () => {
  submitAttempted.value = true;
  if (!form.value.name || !form.value.email || !form.value.manager_name || !form.value.manager_email || !form.value.manager_password) {
    toast.add({
      title: 'Campos obrigatórios',
      description: 'Preencha os dados da empresa e do gerente.',
      color: 'error'
    });
    return;
  }

  if (form.value.manager_password.length < 6) {
    toast.add({
      title: 'Senha muito curta',
      description: 'A senha do gerente deve ter no mínimo 6 caracteres.',
      color: 'error'
    });
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/companies', {
      method: 'POST',
      body: form.value
    });

    if (response && response.success) {
      toast.add({
        title: 'Sucesso!',
        description: 'Empresa criada com sucesso.',
        color: 'success'
      });
      router.push('/admin/companies');
    } else {
      throw new Error("Failed to create company");
    }
  } catch (error) {
    console.error('Error creating company:', error);
    toast.add({
      title: 'Erro',
      description: 'Ocorreu um erro ao criar a empresa.',
      color: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>
