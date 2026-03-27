<template>
  <div class="h-[calc(100vh-128px)] flex flex-col gap-4 pt-0 md:pt-6">
    <!-- Re-use the bikers list behind the modal -->
    <TableBase
      class="flex-1 min-h-0 bg-white rounded-lg pt-2 md:pt-5 pb-0 px-0 shadow-sm border border-gray-200"
      :loading="isLoading"
      :rows="filteredBikers"
      :total-items="filteredBikers.length"
      :columns="columns"
      :actions="tableActions"
      v-model:page="page"
      v-model:per_page="itemsPerPage"
      hide-edit
      hide-delete
    >
      <template #filter>
        <div
          class="w-full px-5 pb-4 flex flex-wrap items-center justify-between gap-4"
        >
          <div class="flex flex-wrap items-center gap-4 flex-1">
            <div class="relative w-full max-w-sm">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="h-5 w-5 text-gray-400"
                />
              </div>
              <input
                id="search"
                v-model="search"
                type="text"
                class="block w-full rounded-lg border border-gray-300 bg-white p-2 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm"
                placeholder="Buscar entregador..."
              />
            </div>
          </div>

          <NuxtLink to="/admin/bikers/create">
            <button
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm whitespace-nowrap"
            >
              <UIcon name="i-heroicons-plus" class="h-5 w-5" />
              Adicionar
            </button>
          </NuxtLink>
        </div>
      </template>

      <template #status="{ row }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
            row.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800',
          ]"
        >
          {{ row.isActive ? "Ativo" : "Inativo" }}
        </span>
      </template>
    </TableBase>

    <!-- Biker Detail Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
        >
          <div
            class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            @click="closeModal"
          ></div>

          <div class="relative z-10 w-full max-w-lg">
            <div class="overflow-hidden rounded-2xl bg-white shadow-2xl">
              <!-- Header -->
              <div
                class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50"
              >
                <h2 class="text-lg font-bold text-gray-900">
                  Detalhes do Entregador
                </h2>
                <button
                  type="button"
                  class="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition cursor-pointer"
                  @click="closeModal"
                >
                  <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
                </button>
              </div>

              <!-- Loading -->
              <div
                v-if="isLoadingBiker"
                class="flex items-center justify-center py-16"
              >
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-8 h-8 animate-spin text-primary"
                />
              </div>

              <!-- Biker Info -->
              <div v-else-if="biker" class="p-6 space-y-6">
                <!-- Avatar + Name -->
                <div class="flex items-center gap-4">
                  <div
                    class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0"
                  >
                    {{ biker.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">
                      {{ biker.name }}
                    </h3>
                    <span
                      :class="[
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1',
                        biker.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800',
                      ]"
                    >
                      {{ biker.isActive ? "Ativo" : "Inativo" }}
                    </span>
                  </div>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon
                        name="i-heroicons-envelope"
                        class="w-4 h-4 text-gray-400"
                      />
                      <p
                        class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
                      >
                        Email
                      </p>
                    </div>
                    <p class="font-medium text-gray-900 break-all">
                      {{ biker.email || "Não informado" }}
                    </p>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon
                        name="i-heroicons-phone"
                        class="w-4 h-4 text-gray-400"
                      />
                      <p
                        class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
                      >
                        Telefone
                      </p>
                    </div>
                    <p class="font-medium text-gray-900">
                      {{ biker.phone || "Não informado" }}
                    </p>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon
                        name="i-heroicons-calendar"
                        class="w-4 h-4 text-gray-400"
                      />
                      <p
                        class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
                      >
                        Cadastrado em
                      </p>
                    </div>
                    <p class="font-medium text-gray-900">
                      {{ formatDate(biker.createdAt) }}
                    </p>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-1">
                      <UIcon
                        name="i-heroicons-identification"
                        class="w-4 h-4 text-gray-400"
                      />
                      <p
                        class="text-xs text-gray-500 uppercase font-semibold tracking-wider"
                      >
                        ID
                      </p>
                    </div>
                    <p
                      class="font-medium text-gray-900 text-xs font-mono break-all"
                    >
                      {{ biker.id }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Error State -->
              <div v-else class="p-6 text-center py-12">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-12 h-12 mx-auto text-red-400 mb-3"
                />
                <p class="text-gray-600 font-medium">
                  Entregador não encontrado.
                </p>
              </div>

              <!-- Footer -->
              <div
                class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50"
              >
                <button
                  type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  @click="closeModal"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "admin",
});

interface Biker {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

const route = useRoute();
const auth = useAuthStore();
const { user } = storeToRefs(auth);

const bikers = ref<Biker[]>([]);
const isLoading = ref(false);
const search = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const showModal = ref(true);
const isLoadingBiker = ref(false);
const biker = ref<Biker | null>(null);

const companyId = computed(() => user.value?.company?.id ?? "");
const bikerId = computed(() => route.params.id as string);

const filteredBikers = computed(() => {
  if (!search.value) return bikers.value;
  const term = search.value.toLowerCase();
  return bikers.value.filter(
    (b) =>
      b.name.toLowerCase().includes(term) ||
      b.email.toLowerCase().includes(term),
  );
});

const columns = [
  { key: "name", label: "Nome", sm: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Telefone" },
  { key: "status", label: "Status" },
];

const tableActions: any[] = [
  {
    name: "Ver Detalhes",
    action: (row: any) => navigateTo(`/admin/bikers/${row.id}`),
  },
];

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => {
    navigateTo("/admin/bikers");
  }, 200);
};

const fetchBikers = async (companyId: string) => {
  isLoading.value = true;
  try {
    const response = await $fetch<{ success: boolean; data?: Biker[] }>(
      `/api/bikers?companyId=${companyId}`,
    );
    bikers.value = Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching bikers:", error);
    bikers.value = [];
  } finally {
    isLoading.value = false;
  }
};

const loadBikerDetail = async () => {
  isLoadingBiker.value = true;
  try {
    // Wait for bikers list to load, then find the biker by ID
    await nextTick();
    const found = bikers.value.find((b) => b.id === bikerId.value);
    if (found) {
      biker.value = found;
    } else {
      // If not in the list yet, try fetching all and finding
      if (companyId.value && bikers.value.length === 0) {
        await fetchBikers(companyId.value);
        biker.value = bikers.value.find((b) => b.id === bikerId.value) || null;
      }
    }
  } catch (error) {
    console.error("Error loading biker detail:", error);
    biker.value = null;
  } finally {
    isLoadingBiker.value = false;
  }
};

watch(
  companyId,
  async (id) => {
    if (id) {
      await fetchBikers(id);
      await loadBikerDetail();
    }
  },
  { immediate: true },
);
</script>
