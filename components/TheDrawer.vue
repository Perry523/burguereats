<template>
  <div :class="isLogin ? 'h-screen' : 'h-sm'" class="drawer lg:h-screen">
    <input
      id="my-drawer"
      type="checkbox"
      class="drawer-toggle"
      v-model="drawer.active"
    />
    <div class="bg-base-200 drawer-content flex h-full overflow-auto">
      <slot></slot>
    </div>
    <div class="drawer-side z-50 shadow-xl">
      <label for="my-drawer" class="drawer-overlay z-50"></label>
      <ul
        class="bg-base-100 menu p-0 text-base gap-0 w-80 min-w-80 max-w-80 h-full z-50 relative overflow-y-auto flex-nowrap pb-3"
      >
        <XMarkIcon
          @click="drawer.active = false"
          class="w-6 right-2 absolute top-2"
        />
        <div class="flex items-center pl-2 pt-3 pb-1 min-w-0">
          <div
            class="w-8 h-8 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center ml-1 flex-shrink-0 shadow-lg"
          >
            <span class="text-white font-bold text-lg">🍅</span>
          </div>
          <div class="ml-2">
            <span class="text-lg font-bold text-primary">Tomatiza</span>
          </div>
        </div>
        <li
          class="my-1"
          v-for="{ to, label, icon, items, ref } in routes"
          :key="label"
        >
          <details :ref="ref" v-if="items" :open="open">
            <summary class="font-semibold min-w-0">
              <component
                :is="icon"
                class="w-5 h-5 mt-[2px] flex-shrink-0"
              ></component>
              <span class="truncate">
                {{ label }}
              </span>
            </summary>
            <ul>
              <li
                class="font-semibold cursor-pointer min-w-0"
                :class="
                  item.to === route.path
                    ? 'bg-red-600 hover:bg-red-700 !text-white rounded-r-full border-r-2 border-red-600'
                    : ''
                "
                v-for="(item, i) in items"
                :key="i"
              >
                <nuxt-link
                  @click="drawer.active = false"
                  :class="item.to === route.path ? '!text-white' : ''"
                  :to="item.to"
                  class="truncate block"
                  >{{ item.label }}</nuxt-link
                >
              </li>
            </ul>
          </details>
          <div
            v-else
            @click="
              () => {
                router.push(`${to}`);
                drawer.active = false;
              }
            "
            class="flex font-semibold items-center py-2 pr-1 cursor-pointer relative min-w-0"
            :class="[
              to === route.path
                ? 'bg-orange-600 hover:bg-orange-600 text-contrast rounded-r-full border-r-2 border-orange-600'
                : '',
            ]"
          >
            <custom-icon
              v-if="typeof icon === 'string'"
              :url="icon"
              class="w-5 h-5 flex-shrink-0"
            ></custom-icon>
            <component
              v-else
              :is="icon"
              class="w-5 h-5 flex-shrink-0"
            ></component>
            <a class="truncate">{{ label }}</a>
          </div>
        </li>
        <li class="my-1">
          <nuxt-link
            to="/perfil"
            class="flex font-semibold items-center py-2 pr-1 cursor-pointer relative min-w-0"
          >
            <UserCircleIcon class="w-5 h-5 flex-shrink-0"></UserCircleIcon>
            <a class="truncate">Meus dados</a>
          </nuxt-link>
        </li>
        <li>
          <div
            @click="logout()"
            class="flex font-semibold items-center py-2 pr-1 cursor-pointer relative min-w-0"
          >
            <ArrowLeftOnRectangleIcon
              class="w-5 h-5 flex-shrink-0"
            ></ArrowLeftOnRectangleIcon>
            <a class="truncate">Sair</a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDrawer } from "~/stores/drawer";
import { useLoginStore } from "~/stores/user";
import { useBusinessSettingsStore } from "~/stores/businessSettings";
import type { MenuItem } from "~/types";
import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
const router = useRouter();
const route = useRoute();
const drawer = useDrawer();
const user = useLoginStore();
const socialRef = ref();
const financasRef = ref();
const productsRef = ref();
const adminRef = ref();
const settingsRef = ref();
const open = ref(false);
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
async function logout() {
  try {
    // Sign out from Supabase Auth
    const supabase = useSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    // Clear local store
    user.logout();

    // Close drawer
    drawer.active = false;

    // Redirect to login page
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    // Still clear local store and redirect even if Supabase logout fails
    user.logout();
    drawer.active = false;
    router.push("/login");
  }
}
function handleToggleOption() {
  const social = [
    "social-connect-simple",
    "test-posting",
    "rascunhos",
    "content-calendar",
    "ai-content",
    "instagram-posts",
    "instagram-connection",
    "facebook-connection",
  ];
  const financeiro = ["receitas", "contas", "relatorio", "movimentacoes"];
  const products = ["produtos", "movimentacao-produtos", "orders"];
  const admin = ["config", "business-settings", "admin"];
  const settings = ["settings", "test-social-integration"];

  const routeName = route.path.split("/")[1];
  const fullPath = route.path.substring(1); // Remove leading slash

  if (
    social.includes(routeName) ||
    social.some((path) => fullPath.startsWith(path))
  ) {
    if (socialRef.value) socialRef.value[0].open = true;
  }
  if (financeiro.includes(routeName)) {
    if (financasRef.value) financasRef.value[0].open = true;
  }
  if (products.includes(routeName)) {
    if (productsRef.value) productsRef.value[0].open = true;
  }
  if (admin.includes(routeName) || fullPath.startsWith("admin/")) {
    if (adminRef.value) adminRef.value[0].open = true;
  }
  if (settings.includes(routeName) || fullPath.startsWith("settings/")) {
    if (settingsRef.value) settingsRef.value[0].open = true;
  }
}
import {
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  HomeIcon,
  ChartPieIcon,
  BuildingOfficeIcon,
  WrenchScrewdriverIcon,
  CameraIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/vue/24/solid";
// Use MenuItem type from types/index.ts
type Routes = MenuItem;
const routes = computed(() => {
  const businessSettings = useBusinessSettingsStore();

  const baseRoutes: Routes[] = [
    // 📊 VISÃO GERAL
    {
      to: "/",
      label: "Visão Geral",
      icon: HomeIcon,
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: ChartPieIcon,
    },

    // 📱 INSTAGRAM
    {
      label: "Instagram",
      icon: CameraIcon,
      ref: "instagramRef",
      items: [
        {
          label: "Conexão Instagram",
          to: "/social-connect-simple",
        },
        {
          label: "Posts do Instagram",
          to: "/instagram-posts",
        },
        {
          label: "Criar Posts",
          to: "/test-posting",
        },
        {
          label: "Rascunhos",
          to: "/rascunhos",
        },
      ],
    },

    // 📘 FACEBOOK
    {
      label: "Facebook",
      icon: GlobeAltIcon,
      ref: "facebookRef",
      items: [
        {
          label: "Posts do Facebook",
          to: "/facebook-posts",
        },
        {
          label: "Páginas Facebook",
          to: "/facebook-pages",
        },
      ],
    },

    // 🤖 CONTEÚDO & IA
    {
      label: "Conteúdo & IA",
      icon: SparklesIcon,
      ref: "contentRef",
      items: [
        {
          label: "Calendário de Conteúdo",
          to: "/content-calendar",
        },
        {
          label: "Gerador de Conteúdo IA",
          to: "/ai-content",
        },
      ],
    },

    // 👥 RELACIONAMENTO
    {
      to: "/clientes",
      label: "Clientes",
      icon: UserGroupIcon,
    },
  ];

  // Conditionally add scheduling module
  if (businessSettings.isSchedulingEnabled) {
    baseRoutes.push({
      to: "/agenda",
      label: "Agendamentos",
      icon: CalendarDaysIcon,
    });
  }

  // Conditionally add products module
  if (businessSettings.isProductsEnabled) {
    baseRoutes.push({
      label: "Produtos",
      icon: ShoppingBagIcon,
      ref: "productsRef",
      items: [
        {
          label: "Catálogo",
          to: "/produtos",
        },
        {
          label: "Estoque",
          to: "/movimentacao-produtos",
        },
        {
          label: "Pedidos",
          to: "/orders",
        },
      ],
    });
  }

  // Always show finances
  baseRoutes.push({
    label: "Finanças",
    icon: CurrencyDollarIcon,
    ref: "financasRef",
    items: [
      {
        label: "Receitas",
        to: "/receitas",
      },
      {
        label: "Despesas",
        to: "/contas",
      },
      {
        label: "Relatórios",
        to: "/relatorio",
      },
      {
        label: "Movimentações",
        to: "/movimentacoes",
      },
    ],
  });

  // ⚙️ ADMINISTRAÇÃO
  baseRoutes.push({
    label: "Administração",
    icon: BuildingOfficeIcon,
    ref: "adminRef",
    items: [
      {
        label: "Perfil da Empresa",
        to: "/config",
      },
      {
        label: "Módulos & Recursos",
        to: "/business-settings",
      },
      {
        label: "Credenciais Sociais",
        to: "/admin/social-credentials",
      },
      {
        label: "Usuários & Permissões",
        to: "/admin/users",
      },
    ],
  });

  // 🔧 CONFIGURAÇÕES
  baseRoutes.push({
    label: "Configurações",
    icon: WrenchScrewdriverIcon,
    ref: "settingsRef",
    items: [
      {
        label: "Preferências",
        to: "/settings/preferences",
      },
      {
        label: "Notificações",
        to: "/settings/notifications",
      },
      {
        label: "Integrações",
        to: "/settings/integrations",
      },
      {
        label: "Teste de Funcionalidades",
        to: "/test-social-integration",
      },
    ],
  });
  // Apply role-based filtering
  if (user.role === "attendant") {
    return baseRoutes.filter(
      (route) => !attendantRoutesBlocked.includes(route.label)
    );
  }
  if (user.role === "professional") {
    return baseRoutes.filter(
      (route) => !professionalRoutesBlocked.includes(route.label)
    );
  }

  return baseRoutes;
});

const attendantRoutesBlocked = ["Administração", "Finanças", "Produtos"];
const professionalRoutesBlocked = [
  "Administração",
  "Finanças",
  "Produtos",
  "Clientes",
];
onMounted(() => {
  handleToggleOption();
});
</script>
