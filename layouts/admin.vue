<template>
  <div class="h-screen w-full bg-slate-950 overflow-hidden">
    <div class="relative flex h-full flex-col lg:flex-row">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
        @click="closeSidebar"
      ></div>

      <aside
        :class="[
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0 lg:flex',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div class="border-b border-white/10 p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
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
              <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
            </button>
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
            icon="i-heroicons-arrow-right-on-rectangle"
          >
            Sair
          </UButton>
        </div>
      </aside>

      <div class="flex flex-1 flex-col bg-slate-50 lg:ml-0">
        <header
          class="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur"
        >
          <div
            class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-white p-2 text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100 lg:hidden"
                @click="toggleSidebar"
              >
                <span class="sr-only">Abrir menu</span>
                <UIcon name="i-heroicons-bars-3" class="h-5 w-5" />
              </button>
              <div>
                <h1 class="text-lg font-semibold text-slate-900 sm:text-xl">
                  {{ activeNavLabel }}
                </h1>
                <p class="text-xs text-slate-500 sm:text-sm">
                  {{ companyName }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
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
        <main class="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="mx-auto w-full max-w-6xl space-y-6">
            <slot />
          </div>
        </main>
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
  { label: "Dashboard", to: "/admin", icon: "i-heroicons-home-modern" },
  { label: "Pedidos", to: "/admin/orders", icon: "i-heroicons-shopping-bag" },
  { label: "Pratos", to: "/admin/dishes", icon: "i-heroicons-squares-2x2" },
  { label: "Produtos", to: "/admin/products", icon: "i-heroicons-cube" },
  { label: "Categorias", to: "/admin/categories", icon: "i-heroicons-tag" },
  {
    label: "Entregadores",
    to: "/admin/bikers",
    icon: "i-heroicons-truck",
  },

  {
    label: "Empresa",
    to: "/admin/empresa",
    icon: "i-heroicons-building-storefront",
  },
  {
    label: "Perfil",
    to: "/admin/profile",
    icon: "i-heroicons-user-circle",
  },
];

const bikerNavItems = [
  {
    label: "Dashboard",
    to: "/admin/biker-dashboard",
    icon: "i-heroicons-home-modern",
  },
  {
    label: "Entregas",
    to: "/admin/deliveries",
    icon: "i-heroicons-truck",
  },
  {
    label: "Novo Pedido",
    to: "/admin/deliveries/create",
    icon: "i-heroicons-plus-circle",
  },
  {
    label: "Perfil",
    to: "/admin/profile",
    icon: "i-heroicons-user-circle",
  },
];

const navItems = computed(() => {
  const items = authStore.user?.role === "biker" ? bikerNavItems : adminNavItems;
  const companyType = authStore.user?.company?.type;
  if (companyType === "delivery") {
    return items.filter((item: any) => item.to !== "/admin/pos");
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
  () => authStore.user?.company?.name ?? "Restaurante"
);
const companyEmail = computed(() => authStore.user?.company?.email ?? "");
const userName = computed(() => authStore.user?.name ?? "Administrador");
const userEmail = computed(() => authStore.user?.email ?? "");
const companyInitials = computed(() => getInitials(companyName.value));
const userInitials = computed(() =>
  getInitials(authStore.user?.name ?? userName.value)
);
const activeNavLabel = computed(() => {
  const current = navItems.value.find((item: any) => isRouteActive(item.to));
  return current?.label ?? "Painel";
});

watch(
  () => route.path,
  () => {
    closeSidebar();
  }
);

const handleLogout = async () => {
  await authStore.logout();
  await navigateTo("/login");
};
</script>
