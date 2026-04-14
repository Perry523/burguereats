<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <div
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200 flex flex-col"
    >
      <!-- Filter Bar -->
      <div>
        <div class="flex justify-between items-center">
          <div
            class="w-full px-3 sm:px-5 pb-1 md:pb-4 flex flex-wrap items-center justify-between gap-2"
          >
            <h1
              class="text-xl font-bold text-gray-900 hidden lg:block mr-2"
            >
              Escala de Entregadores
            </h1>

            <div
              class="flex flex-wrap items-center gap-2 flex-1 lg:flex-initial lg:ml-auto"
            >
              <input
                v-model="selectedDate"
                type="date"
                class="rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary"
              />

              <select
                v-model="filterCompanyId"
                class="rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[120px] sm:min-w-[160px]"
              >
                <option value="">Todas Empresas</option>
                <option v-for="c in companies" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>

              <select
                v-model="filterStatus"
                class="rounded-lg border border-gray-300 bg-white p-2 text-xs sm:text-sm text-gray-700 shadow-sm focus:border-primary focus:ring-primary min-w-[100px] sm:min-w-[130px]"
              >
                <option value="open">Abertas</option>
                <option value="closed">Fechadas</option>
                <option value="all">Todas</option>
              </select>

              <button
                @click="fetchAssignments"
                class="flex items-center justify-center p-2 text-gray-500 hover:text-primary transition-colors bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                title="Atualizar"
              >
                <UIcon
                  name="i-heroicons-arrow-path"
                  :class="[
                    'h-4 w-4 sm:h-5 sm:w-5',
                    isLoading ? 'animate-spin' : '',
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Loading bar -->
        <div class="relative w-full h-3 overflow-hidden">
          <hr class="mt-1 border-base-200 -mb-[2px] sm:mt-1" />
          <div
            v-if="isLoading"
            class="absolute w-full h-[2px] bg-primary animate-loading"
          ></div>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div class="overflow-auto flex-1 bg-white">
        <!-- Table-like header -->
        <div
          class="bg-gray-50 sm:bg-gray-100 sticky top-0 z-10 shadow-sm"
        >
          <div
            class="grid grid-cols-[1fr_auto_auto_auto] items-center px-4 sm:px-6 py-3"
          >
            <span
              class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800"
              >Empresa</span
            >
            <span
              class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 w-24 sm:w-32 text-center hidden sm:block"
              >Horário</span
            >
            <span
              class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 w-24 sm:w-32 text-center"
              >Entregadores</span
            >
            <span
              class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 w-20 sm:w-24 text-right"
              >Ações</span
            >
          </div>
        </div>

        <!-- Company Rows -->
        <div class="divide-y divide-gray-200 bg-white">
          <div
            v-if="companiesWithAssignments.length === 0 && !isLoading"
            class="px-6 py-12 text-center text-sm text-gray-500"
          >
            Nenhuma empresa encontrada para os filtros selecionados.
          </div>

          <div
            v-for="company in companiesWithAssignments"
            :key="company.id"
          >
            <!-- Company row -->
            <div
              class="grid grid-cols-[1fr_auto_auto_auto] items-center px-4 sm:px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              @click="toggleExpand(company.id)"
            >
              <!-- Name -->
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="h-9 w-9 rounded-full shrink-0 flex items-center justify-center"
                  :class="
                    company.isOpen
                      ? 'bg-primary/10'
                      : 'bg-gray-100'
                  "
                >
                  <UIcon
                    name="i-ph-storefront-duotone"
                    class="w-4 h-4"
                    :class="
                      company.isOpen
                        ? 'text-primary'
                        : 'text-gray-400'
                    "
                  />
                </div>
                <div class="min-w-0">
                  <p
                    class="text-sm font-semibold text-gray-900 truncate"
                  >
                    {{ company.name }}
                  </p>
                  <p
                    v-if="company.todayHours"
                    class="text-xs text-gray-500 sm:hidden"
                  >
                    {{ company.todayHours.open_time }} -
                    {{ company.todayHours.close_time }}
                  </p>
                </div>
              </div>

              <!-- Hours (desktop) -->
              <div class="w-24 sm:w-32 text-center hidden sm:block">
                <span
                  v-if="company.todayHours"
                  class="text-sm text-gray-700"
                >
                  {{ company.todayHours.open_time }} -
                  {{ company.todayHours.close_time }}
                </span>
                <span v-else class="text-xs text-gray-400 italic"
                  >Fechada</span
                >
              </div>

              <!-- Count badge -->
              <div class="w-24 sm:w-32 text-center">
                <span
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    company.assignments.length > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-500',
                  ]"
                >
                  {{ company.assignments.length }}
                  {{
                    company.assignments.length === 1
                      ? "moto"
                      : "motos"
                  }}
                </span>
              </div>

              <!-- Actions -->
              <div class="w-20 sm:w-24 flex items-center justify-end gap-2">
                <button
                  @click.stop="openAssignModal(company)"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-primary bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <UIcon name="i-heroicons-plus" class="w-3.5 h-3.5" />
                  <span class="hidden sm:inline">Vincular</span>
                </button>
                <UIcon
                  :name="
                    expandedCompanies.has(company.id)
                      ? 'i-heroicons-chevron-up'
                      : 'i-heroicons-chevron-down'
                  "
                  class="w-4 h-4 text-gray-400 shrink-0"
                />
              </div>
            </div>

            <!-- Expanded biker list -->
            <div
              v-if="expandedCompanies.has(company.id)"
              class="bg-gray-50/50 border-t border-gray-100"
            >
              <div
                v-if="company.assignments.length === 0"
                class="px-6 py-4 text-center text-gray-400 text-sm"
              >
                Nenhum entregador vinculado nesta data.
              </div>
              <div v-else class="divide-y divide-gray-100">
                <div
                  v-for="a in company.assignments"
                  :key="a.id"
                  class="flex items-center justify-between px-6 sm:px-10 py-2.5 hover:bg-gray-100/50 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <UIcon
                        name="i-ph-motorcycle-duotone"
                        class="w-3.5 h-3.5 text-gray-500"
                      />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">
                        {{ a.biker_name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ a.biker_phone || a.biker_email }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span
                      :class="[
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        a.status === 'confirmado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{
                        a.status === "confirmado"
                          ? "Confirmado"
                          : "Cancelado"
                      }}
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
        </div>
      </div>

      <!-- Footer with summary -->
      <div
        class="mt-auto flex flex-row items-center justify-between border-t border-gray-200 pt-2 pb-2 px-2 sm:pt-3 sm:pb-3 sm:px-6 gap-2"
      >
        <div
          class="text-[10px] sm:text-sm text-gray-500"
        >
          {{ companiesWithAssignments.length }}
          {{ companiesWithAssignments.length === 1 ? "empresa" : "empresas" }}
          •
          {{ totalAssignments }}
          {{ totalAssignments === 1 ? "entregador escalado" : "entregadores escalados" }}
        </div>
        <div class="text-[10px] sm:text-sm text-gray-400">
          {{ formattedDate }}
        </div>
      </div>
    </div>

    <!-- Assign Modal -->
    <BaseDialog
      v-model="showAssignModal"
      :title="'Vincular Entregador a ' + (assignCompany?.name || '')"
    >
      <div class="p-4 space-y-4">
        <p class="text-sm text-gray-600">
          Selecione o entregador e a data para vincular. O sistema
          verificará conflitos de horário automaticamente.
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Entregador</label
          >
          <select
            v-model="assignForm.biker_id"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm bg-white text-gray-700"
          >
            <option value="" disabled>Selecione o entregador...</option>
            <option v-for="b in allBikers" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Data</label
          >
          <input
            v-model="assignForm.date"
            type="date"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        <div
          v-if="assignError"
          class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
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
            {{ isSubmitting ? "Vinculando..." : "Vincular" }}
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

const isAdmin = computed(() => user.value?.role === "admin");
const managerCompanyId = computed(
  () => user.value?.company?.id || user.value?.companyId || "",
);

const todayStr = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
};

const selectedDate = ref(todayStr());
const filterCompanyId = ref("");
const filterStatus = ref("open");

const companies = ref<any[]>([]);
const assignmentsByCompany = ref<Record<string, any[]>>({});
const allBikers = ref<any[]>([]);
const isLoading = ref(false);
const isUpdating = ref(false);

// Expand/collapse
const expandedCompanies = ref(new Set<string>());
const toggleExpand = (id: string) => {
  if (expandedCompanies.value.has(id)) {
    expandedCompanies.value.delete(id);
  } else {
    expandedCompanies.value.add(id);
  }
  // Force reactivity
  expandedCompanies.value = new Set(expandedCompanies.value);
};

// Modal
const showAssignModal = ref(false);
const assignCompany = ref<any>(null);
const isSubmitting = ref(false);
const assignError = ref("");
const assignForm = ref({
  biker_id: "",
  date: todayStr(),
});

const getDayOfWeek = (dateStr: string) => {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.getUTCDay();
};

const formattedDate = computed(() => {
  const parts = selectedDate.value.split("-");
  if (parts.length !== 3) return selectedDate.value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
});

const totalAssignments = computed(() => {
  return companiesWithAssignments.value.reduce(
    (sum, c) => sum + c.assignments.length,
    0,
  );
});

const companiesWithAssignments = computed(() => {
  const dayIdx = getDayOfWeek(selectedDate.value);
  let list = companies.value;
  if (filterCompanyId.value) {
    list = list.filter((c) => c.id === filterCompanyId.value);
  }
  return list
    .map((c) => {
      const hours = c.operating_hours?.[dayIdx];
      const isOpen = !!(hours?.enabled && hours?.open_time && hours?.close_time);
      return {
        ...c,
        todayHours: isOpen ? hours : null,
        isOpen,
        assignments: assignmentsByCompany.value[c.id] || [],
      };
    })
    .filter((c) => {
      if (filterStatus.value === "open") return c.isOpen;
      if (filterStatus.value === "closed") return !c.isOpen;
      return true;
    });
});

// Auto-expand companies that have assignments
const autoExpandWithAssignments = () => {
  const newExpanded = new Set<string>();
  for (const company of companiesWithAssignments.value) {
    if (company.assignments.length > 0) {
      newExpanded.add(company.id);
    }
  }
  expandedCompanies.value = newExpanded;
};

const openAssignModal = (company: any) => {
  assignCompany.value = company;
  assignForm.value = { biker_id: "", date: selectedDate.value };
  assignError.value = "";
  showAssignModal.value = true;
};

const fetchCompanies = async () => {
  try {
    if (isAdmin.value) {
      const res = await $fetch<{ success: boolean; data?: any[] }>(
        "/api/companies",
      );
      companies.value = res?.data || [];
    } else if (managerCompanyId.value) {
      const res = await $fetch<{ success: boolean; data?: any }>(
        `/api/companies/${managerCompanyId.value}`,
      );
      companies.value = res?.data ? [res.data] : [];
    }
  } catch (e) {
    console.error("Error fetching companies:", e);
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

    const grouped: Record<string, any[]> = {};
    for (const a of all) {
      if (!grouped[a.company_id]) grouped[a.company_id] = [];
      grouped[a.company_id].push(a);
    }
    assignmentsByCompany.value = grouped;

    // Auto-expand companies that have bikers
    nextTick(() => autoExpandWithAssignments());
  } catch (error) {
    console.error("Error fetching assignments:", error);
    assignmentsByCompany.value = {};
  } finally {
    isLoading.value = false;
  }
};

const fetchAllBikers = async () => {
  try {
    let url = "/api/bikers";
    if (!isAdmin.value && managerCompanyId.value) {
      url += `?companyId=${managerCompanyId.value}`;
    }
    const res = await $fetch<{ success: boolean; data?: any[] }>(url);
    allBikers.value = res?.data || [];
  } catch (e) {
    console.error("Error fetching bikers:", e);
  }
};

const toggleStatus = async (assignment: any, newStatus: string) => {
  isUpdating.value = true;
  try {
    const res = await $fetch<{ success: boolean }>(
      `/api/biker-assignments/${assignment.id}`,
      {
        method: "PUT" as any,
        body: { status: newStatus },
      },
    );
    if (res.success) {
      assignment.status = newStatus;
      toast.add({
        color: "success",
        title:
          newStatus === "cancelado"
            ? "Vinculação cancelada"
            : "Vinculação reativada",
      });
    }
  } catch (error) {
    console.error("Error toggling status:", error);
    toast.add({ color: "error", title: "Erro ao atualizar status" });
  } finally {
    isUpdating.value = false;
  }
};

const submitAssignment = async () => {
  if (!assignCompany.value) return;
  isSubmitting.value = true;
  assignError.value = "";
  try {
    const res = await $fetch<{ success: boolean }>("/api/biker-assignments", {
      method: "POST" as any,
      body: {
        biker_id: assignForm.value.biker_id,
        company_id: assignCompany.value.id,
        date: assignForm.value.date,
      },
    });
    if (res.success) {
      toast.add({
        color: "success",
        title: "Entregador vinculado com sucesso!",
      });
      showAssignModal.value = false;
      await fetchAssignments();
    }
  } catch (error: any) {
    assignError.value =
      error?.data?.statusMessage || "Erro ao vincular entregador";
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

<style scoped>
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.animate-loading {
  animation: loading 2s linear infinite;
}
</style>
