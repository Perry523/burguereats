<template>
  <div
    class="navbar px-0 lg:hidden bg-base-100 drop-shadow-2xl sm:justify-center items-center min-h-12 h-12 w-full relative"
  >
    <div class="flex justify-between items-center w-full px-2">
      <div class="sm:text-lg font-bold">
        {{ getTitle }}
      </div>
      <div class="flex items-center">
        <!-- <div
          class="btn btn-circle btn-ghost btn-sm"
          @click="
            colorMode.preference =
              colorMode.preference === 'light' ? 'dark' : 'light'
          "
        >
          <SunIcon
            v-if="colorMode.preference === 'dark'"
            class="w-5 cursor-pointer"
          />
          <MoonIcon v-else class="w-5 cursor-pointer" />
        </div> -->
        <div class="btn btn-circle mr-2 btn-ghost btn-sm">
          <Notifications />
        </div>
        <bars3-icon
          v-if="!isLogin"
          @click="openDrawer"
          class="w-6 h-6 lg:hidden cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDrawer } from "~/stores/drawer";
import { Bars3Icon } from "@heroicons/vue/24/solid";
// const router = useRouter();
const drawer = useDrawer();
const route = useRoute();

const isLogin = computed(() => {
  return [
    "/login",
    "/login/",
    "/criar-conta",
    "/criar-conta/",
    "/forgot-password",
    "/forgot-password/",
    "/recover-password",
    "/recover-password/",
  ].includes(route.path);
});
function openDrawer() {
  if (!drawer.active) {
    drawer.toggleActive();
  }
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
</script>
