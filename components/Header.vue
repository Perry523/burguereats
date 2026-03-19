<template>
  <div class="flex items-center justify-between px-4 md:p1-2 bg-base-100">
    <div class="flex items-center">
      <div
        @click="toggleBar"
        class="btn mr-2 btn-circle w-7 h-7 px-1 btn-xs hidden lg:inline-flex"
      >
        <ChevronDoubleRightIcon v-if="toggledBar" />
        <ChevronDoubleLeftIcon v-else />
      </div>
      <div class="sm:text-lg font-bold">
        {{ getTitle }}
      </div>
    </div>
    <div class="flex">
      <div class="btn btn-circle btn-ghost">
        <Notifications />
      </div>
      <div
        class="btn btn-circle btn-ghost"
        @click="
          colorMode.preference =
            colorMode.preference === 'light' ? 'dark' : 'light'
        "
      >
        <SunIcon
          v-if="colorMode.preference === 'dark'"
          class="w-6 cursor-pointer"
        />
        <MoonIcon v-else class="w-6 cursor-pointer" />
      </div>
      <nuxt-link to="/perfil" class="btn btn-circle btn-ghost">
        <nuxt-img
          loading="lazy"
          :src="image"
          alt="Avatar"
          class="w-8 h-8 rounded-full"
        />
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/vue/24/solid";
import { themeChange } from "theme-change";
import { useDrawer } from "~/stores/drawer";
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();
const colorMode = useColorMode();
const drawer = useDrawer();
const image = ref("");

async function getImage() {
  if (authStore.user?.image) image.value = authStore.user.image;
  else {
    image.value = `https://ui-avatars.com/api/?name=${authStore.user?.name?.split(" ")[0] || "User"}`;
  }
}
const { toggledBar } = storeToRefs(drawer);
function toggleBar() {
  toggledBar.value = !toggledBar.value;
}
const getTitle = computed(() => {
  const routeName = useRoute().name;
  if (routeName === "index") return "Dashboard";
  if (routeName === "instagram-connection") return "Conexão Instagram";
  if (routeName === "facebook-connection") return "Conexão Facebook";
  if (routeName === "instagram-posts") return "Posts do Instagram";
  if (routeName === "ai-content") return "Gerador de Conteúdo IA";
  if (routeName === "content-calendar") return "Calendário de Posts";
  if (routeName === "analytics") return "Analytics";
  if (routeName === "business-settings") return "Configurações do Negócio";
  if (routeName === "servicos") return "Serviços";
  if (routeName === "agenda") return "Agendamentos";
  if (routeName === "profissionais") return "Profissionais";
  if (routeName === "clients") return "Clientes";
  if (routeName === "movimentacao-produtos") return "Movimentações de produtos";
  if (routeName === "sales") return "Vendas";
  if (routeName === "movimentacoes") return "Movimentações";
  if (routeName === "relatorios") return "Relatórios";
  if (routeName === "config") return "Perfil do Negócio";
  if (routeName === "produtos") return "Produtos";
  if (routeName === "relatorio") return "Relatório";
  if (routeName === "contas") return "Despesas";
  if (routeName === "receitas") return "Receitas";
  if (routeName === "cores") return "Estilização";
  if (routeName === "clientes") return "Clientes";
  if (routeName === "orders") return "Pedidos";
  return "Tomatiza 🍅";
});
onMounted(() => {
  getImage();
  themeChange(true);
});
</script>
