<template>
  <div
    :class="toggledBar ? 'w-[60px] overflow-hidden' : 'w-64'"
    class="shadow-xl transition-all ease-in-out bg-base-100 hidden lg:block relative"
  >
    <label for="my-drawer" class="drawer-overlay"></label>
    <ul
      :class="toggledBar ? 'w-[58px]' : 'w-64'"
      class="bg-base-100 menu p-0 text-base gap-0 h-full"
    >
      <div class="flex items-center pl-2 pt-3 pb-1 -ml-1">
        <div
          class="w-8 h-8 bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-center ml-1 shadow-lg"
        >
          <span class="text-white font-bold text-lg">🍅</span>
        </div>
        <div v-if="!toggledBar" class="ml-2">
          <span class="text-lg font-bold text-primary">Tomatiza</span>
        </div>
      </div>
      <li
        class="my-1"
        v-for="{ to, label, icon, items, ref } in routes"
        :key="label"
      >
        <details
          :ref="ref"
          @click="toggledBar = false"
          v-if="items"
          :open="open"
        >
          <summary class="font-semibold">
            <component
              :is="icon"
              class="w-5 h-5 mt-[2px]"
              :class="toggledBar ? '-ml-[11px]' : ''"
            ></component>
            <span v-if="!toggledBar">
              {{ label }}
            </span>
          </summary>
          <ul>
            <li
              class="font-semibold cursor-pointer"
              :class="
                item.to === route.path
                  ? 'bg-red-600 hover:bg-red-700 !text-white rounded-r-full border-r-2 border-red-600'
                  : ''
              "
              v-for="(item, i) in items"
              :key="i"
            >
              <nuxt-link
                :class="item.to === route.path ? '!text-white' : ''"
                :to="item.to"
                >{{ item.label }}</nuxt-link
              >
            </li>
          </ul>
        </details>
        <div
          v-else
          @click="router.push(`${to}`)"
          class="flex font-semibold items-center py-2 pr-1 cursor-pointer relative"
          :class="[
            to === route.path
              ? 'bg-red-600 hover:bg-red-700 text-white rounded-r-full border-r-2 border-red-600'
              : 'hover:bg-base-200',
            toggledBar ? 'pl-0' : '',
          ]"
        >
          <custom-icon
            v-if="typeof icon === 'string'"
            :url="icon"
            :class="toggledBar ? 'mx-auto' : ''"
            class="w-5 h-5"
          ></custom-icon>
          <component
            v-else
            :is="icon"
            :class="toggledBar ? 'mx-auto' : ''"
            class="w-5 h-5"
          ></component>

          <a v-if="!toggledBar">{{ label }}</a>
        </div>
      </li>
      <div
        @click="logout()"
        class="flex font-semibold items-center py-3 cursor-pointer"
        :class="!toggledBar ? 'pl-4 gap-2' : '-ml-1'"
      >
        <ArrowLeftOnRectangleIcon
          :class="!toggledBar ? '' : 'mx-auto '"
          class="w-5 h-5"
        ></ArrowLeftOnRectangleIcon>

        <a v-if="!toggledBar">Sair</a>
      </div>
      <!-- <li><a></a></li> -->
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useDrawer } from "~/stores/drawer";
import { useLoginStore } from "~/stores/user";
import { useBusinessSettingsStore } from "~/stores/businessSettings";
import { ArrowLeftOnRectangleIcon } from "@heroicons/vue/24/solid";
const loginStore = useLoginStore();
const router = useRouter();
const route = useRoute();
const open = ref(false);
const drawer = useDrawer();
const { toggledBar } = storeToRefs(drawer);
async function logout() {
  try {
    // Sign out from Supabase Auth
    const supabase = useSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    // Clear local store
    loginStore.logout();

    // Redirect to login page
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    // Still clear local store and redirect even if Supabase logout fails
    loginStore.logout();
    router.push("/login");
  }
}
const instagramRef = ref();
const facebookRef = ref();
const contentRef = ref();
const financasRef = ref();
const productsRef = ref();
const adminRef = ref();
const settingsRef = ref();

watch(toggledBar, (val) => {
  if (val) {
    if (instagramRef.value) instagramRef.value[0].open = false;
    if (facebookRef.value) facebookRef.value[0].open = false;
    if (contentRef.value) contentRef.value[0].open = false;
    if (financasRef.value) financasRef.value[0].open = false;
    if (productsRef.value) productsRef.value[0].open = false;
    if (adminRef.value) adminRef.value[0].open = false;
    if (settingsRef.value) settingsRef.value[0].open = false;
  } else {
    handleToggleOption();
  }
});

function handleToggleOption() {
  const instagram = [
    "social-connect-simple",
    "setup-instagram",
    "gerar-postagem",
    "rascunhos",
    "instagram-posts",
    "test-posting",
  ];
  const facebook = ["facebook-posts", "facebook-pages"];
  const content = ["content-calendar", "ai-content"];
  const financeiro = ["receitas", "contas", "relatorio", "movimentacoes"];
  const products = ["produtos", "movimentacao-produtos", "orders"];
  const admin = ["config", "business-settings", "admin"];
  const settings = ["settings", "test-social-integration"];

  const routeName = route.path.split("/")[1];
  const fullPath = route.path.substring(1); // Remove leading slash

  if (
    instagram.includes(routeName) ||
    instagram.some((path) => fullPath.startsWith(path))
  ) {
    if (instagramRef.value) instagramRef.value[0].open = true;
  }
  if (
    facebook.includes(routeName) ||
    facebook.some((path) => fullPath.startsWith(path))
  ) {
    if (facebookRef.value) facebookRef.value[0].open = true;
  }
  if (
    content.includes(routeName) ||
    content.some((path) => fullPath.startsWith(path))
  ) {
    if (contentRef.value) contentRef.value[0].open = true;
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
onMounted(() => {
  handleToggleOption();
});
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
export type Routes = {
  to?: string;
  label: string;
  icon: typeof CurrencyDollarIcon | string;
  items?: {
    label: string;
    to: string;
  }[];
  ref?: string;
};
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
          label: "Contas de Referência",
          to: "/setup-instagram",
        },
        {
          label: "Gerar Postagem",
          to: "/gerar-postagem",
        },
        {
          label: "Rascunhos",
          to: "/rascunhos",
        },
        {
          label: "Posts do Instagram",
          to: "/instagram-posts",
        },
        {
          label: "Criar Posts",
          to: "/test-posting",
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
    // {
    //   to: "/clientes",
    //   label: "Clientes",
    //   icon: UserGroupIcon,
    // },
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
  // baseRoutes.push({
  //   label: "Finanças",
  //   icon: CurrencyDollarIcon,
  //   ref: "financasRef",
  //   items: [
  //     {
  //       label: "Receitas",
  //       to: "/receitas",
  //     },
  //     {
  //       label: "Despesas",
  //       to: "/contas",
  //     },
  //     {
  //       label: "Relatórios",
  //       to: "/relatorio",
  //     },
  //     {
  //       label: "Movimentações",
  //       to: "/movimentacoes",
  //     },
  //   ],
  // });

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
  // baseRoutes.push({
  //   label: "Configurações",
  //   icon: WrenchScrewdriverIcon,
  //   ref: "settingsRef",
  //   items: [
  //     {
  //       label: "Preferências",
  //       to: "/settings/preferences",
  //     },
  //     {
  //       label: "Notificações",
  //       to: "/settings/notifications",
  //     },
  //     {
  //       label: "Integrações",
  //       to: "/settings/integrations",
  //     },
  //     {
  //       label: "Teste de Funcionalidades",
  //       to: "/test-social-integration",
  //     },
  //   ],
  // });

  // Apply role-based filtering
  if (loginStore.role === "attendant") {
    return baseRoutes.filter(
      (route) => !attendantRoutesBlocked.includes(route.label)
    );
  }
  if (loginStore.role === "professional") {
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
// function toggleBar() {
//   toggledBar.value = !toggledBar.value;
// }
</script>
