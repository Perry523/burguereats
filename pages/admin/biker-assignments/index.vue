<template>
  <div class="space-y-6 pt-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Escala de Entregadores</h1>
        <p class="text-sm text-gray-500 mt-1">Veja quais entregadores estão vinculados a cada empresa por dia</p>
      </div>

      <div class="flex items-center gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Data</label>
          <input
            v-model="selectedDate"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Empresa</label>
          <select
            v-model="filterCompanyId"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-[180px] bg-white text-gray-700"
          >
            <option value="">Todas as empresas</option>
            <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            v-model="filterStatus"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm min-w-[140px] bg-white text-gray-700"
          >
            <option value="open">Abertas</option>
            <option value="closed">Fechadas</option>
            <option value="all">Todas</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Companies with Assigned Bikers -->
    <div v-if="isLoading" class="py-12 text-center text-gray-500">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2" />
      <p>Carregando escala...</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="company in companiesWithAssignments"
        :key="company.id"
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      >
        <!-- Company Header -->
        <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UIcon name="i-ph-storefront-duotone" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-gray-900">{{ company.name }}</h2>
              <p v-if="company.todayHours" class="text-xs text-gray-500">
                Horário: {{ company.todayHours.open_time }} - {{ company.todayHours.close_time }}
              </p>
              <p v-else class="text-xs text-gray-400 italic">Sem horário definido para este dia</p>
            </div>
          </div>
          <button
            @click="openAssignModal(company)"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <UIcon name="i-heroicons-plus" class="w-4 h-4" />
            Vincular
          </button>
        </div>

        <!-- Bikers List -->
        <div v-if="company.assignments.length === 0" class="px-6 py-6 text-center text-gray-400">
          <p class="text-sm">Nenhum entregador vinculado nesta data.</p>
        </div>
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="a in company.assignments"
            :key="a.id"
            class="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <UIcon name="i-ph-motorcycle-duotone" class="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ a.biker_name }}</p>
                <p class="text-xs text-gray-500">{{ a.biker_phone || a.biker_email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  a.status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ a.status === 'confirmado' ? 'Confirmado' : 'Cancelado' }}
              </span>
              <button
                v-if="a.status === 'confirmado'"
                @click="toggleStatus(a, 'cancelado')"
                :disabled="isUpdating"
                class="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                v-else
                @click="toggleStatus(a, 'confirmado')"
                :disabled="isUpdating"
                class="text-xs text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
              >
                Reativar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <BaseDialog v-model="showAssignModal" :title="'Vincular Entregador a ' + (assignCompany?.name || '')">
      <div class="p-4 space-y-4">
        <p class="text-sm text-gray-600">
          Selecione o entregador e a data para vincular. O sistema verificará conflitos de horário automaticamente.
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Entregador</label>
          <select
            v-model="assignForm.biker_id"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white text-gray-700"
          >
            <option value="" disabled>Selecione o entregador...</option>
            <option v-for="b in allBikers" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input
            v-model="assignForm.date"
            type="date"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        <div v-if="assignError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {{ assignError }}
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            @click="showAssignModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="submitAssignment"
            :disabled="isSubmitting || !assignForm.biker_id || !assignForm.date"
            class="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? 'Vinculando...' : 'Vincular' }}
          </button>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();

const isAdmin = computed(() => user.value?.role === 'admin');
const managerCompanyId = computed(() => user.value?.company?.id || user.value?.companyId || '');

const todayStr = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

const selectedDate = ref(todayStr());
const filterCompanyId = ref('');
const filterStatus = ref('open');

const companies = ref<any[]>([]);
const assignmentsByCompany = ref<Record<string, any[]>>({});
const allBikers = ref<any[]>([]);
const isLoading = ref(false);
const isUpdating = ref(false);

// Modal
const showAssignModal = ref(false);
const assignCompany = ref<any>(null);
const isSubmitting = ref(false);
const assignError = ref('');
const assignForm = ref({
  biker_id: '',
  date: todayStr(),
});

const getDayOfWeek = (dateStr: string) => {
  const d = new Date(dateStr + 'T12:00:00Z');
  return d.getUTCDay();
};

const companiesWithAssignments = computed(() => {
  const dayIdx = getDayOfWeek(selectedDate.value);
  let list = companies.value;
  if (filterCompanyId.value) {
    list = list.filter(c => c.id === filterCompanyId.value);
  }
  return list
    .map(c => {
      const hours = c.operating_hours?.[dayIdx];
      const isOpen = !!(hours?.enabled && hours?.open_time && hours?.close_time);
      return {
        ...c,
        todayHours: isOpen ? hours : null,
        isOpen,
        assignments: assignmentsByCompany.value[c.id] || [],
      };
    })
    .filter(c => {
      if (filterStatus.value === 'open') return c.isOpen;
      if (filterStatus.value === 'closed') return !c.isOpen;
      return true;
    });
});

const openAssignModal = (company: any) => {
  assignCompany.value = company;
  assignForm.value = { biker_id: '', date: selectedDate.value };
  assignError.value = '';
  showAssignModal.value = true;
};

const fetchCompanies = async () => {
  try {
    if (isAdmin.value) {
      const res = await $fetch<{ success: boolean; data?: any[] }>('/api/companies');
      companies.value = res?.data || [];
    } else if (managerCompanyId.value) {
      // Manager only sees their own company
      const res = await $fetch<{ success: boolean; data?: any }>(`/api/companies/${managerCompanyId.value}`);
      companies.value = res?.data ? [res.data] : [];
    }
  } catch (e) {
    console.error('Error fetching companies:', e);
  }
};

const fetchAssignments = async () => {
  isLoading.value = true;
  try {
    let url = `/api/biker-assignments?date=${selectedDate.value}`;
    if (!isAdmin.value && managerCompanyId.value) {
      url += `&companyId=${managerCompanyId.value}`;
    }
    const res = await $fetch<{ success: boolean; data?: any[] }>(url);
    const all = res?.data || [];

    // Group by company_id
    const grouped: Record<string, any[]> = {};
    for (const a of all) {
      if (!grouped[a.company_id]) grouped[a.company_id] = [];
      grouped[a.company_id].push(a);
    }
    assignmentsByCompany.value = grouped;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    assignmentsByCompany.value = {};
  } finally {
    isLoading.value = false;
  }
};

const fetchAllBikers = async () => {
  try {
    let url = '/api/bikers';
    if (!isAdmin.value && managerCompanyId.value) {
      url += `?companyId=${managerCompanyId.value}`;
    }
    const res = await $fetch<{ success: boolean; data?: any[] }>(url);
    allBikers.value = res?.data || [];
  } catch (e) {
    console.error('Error fetching bikers:', e);
  }
};

const toggleStatus = async (assignment: any, newStatus: string) => {
  isUpdating.value = true;
  try {
    const res = await $fetch<{ success: boolean }>(`/api/biker-assignments/${assignment.id}`, {
      method: 'PUT' as any,
      body: { status: newStatus },
    });
    if (res.success) {
      assignment.status = newStatus;
      toast.add({ color: 'success', title: newStatus === 'cancelado' ? 'Vinculação cancelada' : 'Vinculação reativada' });
    }
  } catch (error) {
    console.error('Error toggling status:', error);
    toast.add({ color: 'error', title: 'Erro ao atualizar status' });
  } finally {
    isUpdating.value = false;
  }
};

const submitAssignment = async () => {
  if (!assignCompany.value) return;
  isSubmitting.value = true;
  assignError.value = '';
  try {
    const res = await $fetch<{ success: boolean }>('/api/biker-assignments', {
      method: 'POST' as any,
      body: {
        biker_id: assignForm.value.biker_id,
        company_id: assignCompany.value.id,
        date: assignForm.value.date,
      },
    });
    if (res.success) {
      toast.add({ color: 'success', title: 'Entregador vinculado com sucesso!' });
      showAssignModal.value = false;
      await fetchAssignments();
    }
  } catch (error: any) {
    assignError.value = error?.data?.statusMessage || 'Erro ao vincular entregador';
  } finally {
    isSubmitting.value = false;
  }
};

watch(selectedDate, () => {
  fetchAssignments();
});

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  await Promise.all([fetchCompanies(), fetchAllBikers(), fetchAssignments()]);
});
</script>
