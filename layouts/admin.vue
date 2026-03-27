<template>
  <div
    class="min-h-dvh lg:h-dvh w-full bg-slate-100 lg:bg-slate-950 lg:overflow-hidden"
  >
    <div class="relative flex h-full flex-col lg:flex-row">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        @click="closeSidebar"
      ></div>

      <aside
        :class="[
          'fixed inset-y-0 left-0 z-[70] flex w-72 flex-col border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0 lg:flex',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div class="border-b border-white/10 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img
                v-if="companyLogo"
                :src="companyLogo"
                alt="Company Logo"
                class="h-12 w-12 rounded-2xl object-cover"
              />
              <div
                v-else
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold uppercase"
              >
                {{ companyInitials }}
              </div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-white">
                  {{ companyName }}
                </p>
                <p class="text-xs text-white/50">{{ companyEmail }}</p>
              </div>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full p-2 text-white/70 hover:bg-white/10 lg:hidden"
              @click="closeSidebar"
            >
              <UIcon name="i-ph-x" class="h-5 w-5" />
            </button>
          </div>

          <!-- Company Selector for Admins in Sidebar -->
          <div v-if="authStore.user?.role === 'admin'" class="mt-6 px-1">
            <div class="relative">
              <div
                class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"
              >
                <UIcon
                  name="i-ph-storefront-duotone"
                  class="h-5 w-5 text-white/50"
                />
              </div>
              <select
                v-model="authStore.activeCompanyId"
                class="w-full h-11 bg-white/5 border border-white/10 rounded-md text-white sm:text-sm pl-10 pr-10 focus:ring-2 focus:ring-primary-500 appearance-none"
              >
                <option value="" disabled class="bg-slate-900">
                  Selecionar Empresa
                </option>
                <option
                  v-for="company in companies"
                  :key="company.id"
                  :value="company.id"
                  class="bg-slate-900"
                >
                  {{ company.name }}
                </option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <UIcon
                  name="i-heroicons-chevron-down-20-solid"
                  class="h-5 w-5 text-white/50"
                />
              </div>
            </div>
          </div>
        </div>
        <nav class="flex-1 space-y-2 overflow-y-auto p-6">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="closeSidebar"
            :class="[
              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
              isRouteActive(item.to)
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
            ]"
          >
            <UIcon :name="item.icon" class="h-5 w-5" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
        <div class="border-t border-white/10 p-6">
          <UButton
            @click="handleLogout"
            class="w-full justify-center"
            icon="i-ph-sign-out-duotone"
          >
            Sair
          </UButton>
        </div>
      </aside>

      <div class="flex flex-1 flex-col bg-slate-50 min-h-0 relative lg:ml-0">
        <header
          class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur"
        >
          <div
            class="flex items-center justify-between px-3 lg:py-3 py-1 sm:px-6 lg:px-8"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-white p-2 text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100 lg:hidden"
                @click="toggleSidebar"
              >
                <span class="sr-only">Abrir menu</span>
                <UIcon name="i-ph-list" class="h-5 w-5" />
              </button>
              <div>
                <h1 class="text-lg font-semibold text-slate-900 sm:text-xl">
                  {{ activeNavLabel }}
                </h1>
                <!-- <p class="text-xs text-slate-500 sm:text-sm">
                  {{ currentCompanyName }}
                </p> -->
              </div>
            </div>
            <div class="flex items-center gap-3">
              <!-- Wallet Display -->
              <div
                v-if="isBiker"
                class="hidden sm:flex flex-col items-end mr-2 bg-green-50 px-3 py-1 rounded-lg border border-green-100"
              >
                <span
                  class="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none"
                  >Carteira</span
                >
                <span class="text-sm font-bold text-green-700 leading-tight">{{
                  formatCurrency(bikerWallet)
                }}</span>
              </div>

              <Notifications />
              <div class="hidden text-right sm:block">
                <p class="text-sm font-semibold text-slate-900">
                  {{ userName }}
                </p>
                <p class="text-xs text-slate-500">{{ userEmail }}</p>
              </div>
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 text-xs font-semibold uppercase text-white sm:h-11 sm:w-11"
              >
                {{ userInitials }}
              </div>
            </div>
          </div>
        </header>
        <main
          :class="[
            'flex-1 lg:overflow-auto px-2 py-2 sm:px-6 lg:px-8',
            isBiker ? 'pb-24 lg:pb-6' : 'pb-6',
          ]"
        >
          <div class="mx-auto w-full max-w-6xl space-y-6">
            <slot />
          </div>
        </main>

        <!-- Bottom Navigation for Bikers (Mobile Only) - Glued to Bottom -->
        <nav
          v-if="isBiker"
          class="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 pb-safe backdrop-blur-xl lg:hidden"
        >
          <NuxtLink
            v-for="item in bikerBottomNav"
            :key="item.to"
            :to="item.to"
            class="group relative flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300"
            :class="[
              isRouteActive(item.to)
                ? 'text-primary'
                : 'text-slate-400 hover:text-slate-600',
            ]"
          >
            <div
              :class="[
                'flex h-9 w-12 items-center justify-center rounded-xl transition-all duration-300',
                isRouteActive(item.to) ? 'bg-primary/10' : 'bg-transparent',
              ]"
            >
              <UIcon :name="item.icon" class="h-6 w-6" />
            </div>
            <span
              class="text-[10px] font-bold uppercase tracking-tight transition-opacity duration-300"
              :class="[isRouteActive(item.to) ? 'opacity-100' : 'opacity-70']"
            >
              {{ item.label }}
            </span>
          </NuxtLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const route = useRoute();
if (!authStore.user) {
  await authStore.getCurrentUser();
}

const adminNavItems = [
  { label: "Dashboard", to: "/admin", icon: "i-ph-squares-four-duotone" },
  { label: "Pedidos", to: "/admin/orders", icon: "i-ph-shopping-bag-duotone" },
  { label: "Pratos", to: "/admin/dishes", icon: "i-ph-fork-knife-duotone" },
  { label: "Produtos", to: "/admin/products", icon: "i-ph-package-duotone" },
  {
    label: "Categorias",
    to: "/admin/categories",
    icon: "i-ph-list-bullets-duotone",
  },
  {
    label: "Entregadores",
    to: "/admin/bikers",
    icon: "i-ph-motorcycle-duotone",
  },
  {
    label: "Financeiro Moto",
    to: "/admin/bikers-financials",
    icon: "i-ph-money-duotone",
  },
  {
    label: "Pagamentos",
    to: "/admin/payouts",
    icon: "i-ph-bank-duotone",
  },
  {
    label: "Escala",
    to: "/admin/biker-assignments",
    icon: "i-ph-clipboard-text-duotone",
  },
  {
    label: "Empresas",
    to: "/admin/companies",
    icon: "i-ph-buildings-duotone",
  },
  {
    label: "Perfil",
    to: "/admin/profile",
    icon: "i-ph-user-circle-duotone",
  },
];

const managerNavItems = [
  { label: "Dashboard", to: "/admin", icon: "i-ph-squares-four-duotone" },
  { label: "Pedidos", to: "/admin/orders", icon: "i-ph-shopping-bag-duotone" },
  { label: "Pratos", to: "/admin/dishes", icon: "i-ph-fork-knife-duotone" },
  { label: "Produtos", to: "/admin/products", icon: "i-ph-package-duotone" },
  {
    label: "Categorias",
    to: "/admin/categories",
    icon: "i-ph-list-bullets-duotone",
  },
  {
    label: "Entregadores",
    to: "/admin/bikers",
    icon: "i-ph-motorcycle-duotone",
  },
  {
    label: "Empresa",
    to: "/admin/empresa",
    icon: "i-ph-storefront-duotone",
  },
  {
    label: "Perfil",
    to: "/admin/profile",
    icon: "i-ph-user-circle-duotone",
  },
];

const bikerNavItems = [
  {
    label: "Dashboard",
    to: "/admin/biker-dashboard",
    icon: "i-ph-squares-four-duotone",
  },
  {
    label: "Entregas",
    to: "/admin/deliveries",
    icon: "i-ph-motorcycle-duotone",
  },
  {
    label: "Escala",
    to: "/admin/biker-escala",
    icon: "i-ph-clipboard-text-duotone",
  },
  {
    label: "Registros",
    to: "/admin/biker-payments",
    icon: "i-ph-wallet-duotone",
  },
  {
    label: "Pagamentos",
    to: "/admin/payouts",
    icon: "i-ph-bank-duotone",
  },
  {
    label: "Perfil",
    to: "/admin/profile",
    icon: "i-ph-user-circle-duotone",
  },
];

const bikerBottomNav = [
  {
    label: "Início",
    to: "/admin/biker-dashboard",
    icon: "i-ph-squares-four-duotone",
  },
  {
    label: "Escala",
    to: "/admin/biker-escala",
    icon: "i-ph-clipboard-text-duotone",
  },
  {
    label: "Registros",
    to: "/admin/biker-payments",
    icon: "i-ph-wallet-duotone",
  },
  { label: "Pagos", to: "/admin/payouts", icon: "i-ph-bank-duotone" },
];

const navItems = computed(() => {
  const role = authStore.user?.role;
  let items: typeof adminNavItems;

  if (role === "biker") {
    items = [...bikerNavItems];
  } else if (role === "admin") {
    items = [...adminNavItems];
  } else {
    items = [...managerNavItems];
  }

  const companyType = authStore.user?.company?.type;
  if (companyType === "delivery") {
    items = items.filter((item: any) => item.to !== "/admin/pos");
  }
  return items;
});

const getInitials = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "R";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const isRouteActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin";
  }
  return route.path === path || route.path.startsWith(`${path}/`);
};

const companyName = computed(
  () => authStore.user?.company?.name ?? "Restaurante",
);
const companyEmail = computed(() => authStore.user?.company?.email ?? "");
const companyLogo = computed(() => {
  if (authStore.user?.role === "admin" && authStore.activeCompanyId) {
    const selected = companies.value.find(
      (c) => c.id === authStore.activeCompanyId,
    );
    if (selected) return selected.logo;
  }
  return authStore.user?.company?.logo ?? "";
});

const currentCompanyName = computed(() => {
  if (authStore.user?.role === "admin" && authStore.activeCompanyId) {
    const selected = companies.value.find(
      (c) => c.id === authStore.activeCompanyId,
    );
    if (selected) return selected.name;
  }
  return companyName.value;
});

const userName = computed(() => authStore.user?.name ?? "Administrador");
const userEmail = computed(() => authStore.user?.email ?? "");
const companyInitials = computed(() => getInitials(currentCompanyName.value));
const userInitials = computed(() =>
  getInitials(authStore.user?.name ?? userName.value),
);
const activeNavLabel = computed(() => {
  const current = navItems.value.find((item: any) => isRouteActive(item.to));
  return current?.label ?? "Painel";
});

const isBiker = computed(() => authStore.user?.role === "biker");
const bikerWallet = computed(() => authStore.user?.wallet ?? 0);
const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val || 0);
};

// Fetch companies directly to avoid SSR hydration bugs
const companies = ref<any[]>([]);

const fetchCompanies = async () => {
  if (authStore.user?.role === "admin") {
    try {
      const response = await $fetch<any>("/api/companies");
      if (response && response.success) {
        companies.value = response.data;
      }
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  }
};

onMounted(() => {
  fetchCompanies();
});

watch(
  () => authStore.user?.role,
  (newRole) => {
    if (newRole === "admin" && companies.value.length === 0) {
      fetchCompanies();
    }
  },
);

const companyOptions = computed(() => {
  return companies.value.map((c: any) => ({
    label: c.name,
    value: c.id,
  }));
});

onMounted(async () => {
  // fetchCompanies already called in setup
});

watch(
  () => route.path,
  () => {
    closeSidebar();
  },
);

const handleLogout = async () => {
  await authStore.logout();
  await navigateTo("/login");
};
</script>
