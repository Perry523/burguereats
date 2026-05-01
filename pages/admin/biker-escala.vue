<template>
  <div class="space-y-6 pt-2">
    <!-- Header Info -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <UIcon name="i-ph-buildings-duotone" class="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-gray-900">Empresas Vinculadas</h1>
          <p class="text-sm text-gray-500">
            Você está habilitado para realizar entregas e registrar pagamentos nas empresas abaixo.
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-12 text-center text-gray-500">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2" />
      <p>Carregando empresas...</p>
    </div>

    <!-- Companies List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="company in companies"
        :key="company.company_id"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4 hover:border-primary/30 hover:shadow-md transition-all"
      >
        <div class="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
          <img v-if="company.company_logo" :src="company.company_logo" class="w-full h-full object-cover" />
          <UIcon v-else name="i-ph-storefront-duotone" class="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <h3 class="font-bold text-gray-900">{{ company.company_name }}</h3>
          <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 mt-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Vinculado
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="companies.length === 0"
        class="col-span-full py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl text-center"
      >
        <div class="mx-auto h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
          <UIcon name="i-ph-link-break-duotone" class="h-6 w-6 text-gray-400" />
        </div>
        <h3 class="text-sm font-semibold text-gray-900">Nenhuma empresa vinculada</h3>
        <p class="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
          Você ainda não foi vinculado a nenhuma empresa. Peça ao administrador para realizar o seu vínculo.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const isLoading = ref(true);
const companies = ref<any[]>([]);

const fetchCompanies = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data?: any[] }>("/api/bikers/me/companies");
    if (res?.success) {
      companies.value = res.data || [];
    }
  } catch (error) {
    console.error("Error fetching vinculated companies:", error);
    companies.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  await fetchCompanies();
});
</script>
