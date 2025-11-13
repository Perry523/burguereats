import {

  CurrencyDollarIcon,

} from "@heroicons/vue/24/solid";
import { defineStore } from "pinia";
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
const selectedGame = ref("poe");
// const routes = computed(() => {
//   const routes: Routes[] = [
//     {
//       to: "/servicos",
//       label: "Serviços",
//       icon: ScissorsIcon,
//     },
//     {
//       to: "/agenda",
//       label: "Agenda",
//       icon: CalendarDaysIcon,
//     },
//     {
//       to: "/orders",
//       label: "Pedidos",
//       icon: ClipboardDocumentListIcon,
//     },
//     {
//       to: "/profissionais",
//       label: "Profissionais",
//       icon: BriefcaseIcon,
//     },
//     {
//       to: "/clientes",
//       label: "Clientes",
//       icon: UserGroupIcon,
//     },
//     {
//       to: "/config",
//       label: "Meu negócio",
//       icon: BuildingStorefrontIcon,
//     },
//     {
//       to: "/cores",
//       label: "Meu aplicativo",
//       ref: "appRef",
//       icon: DevicePhoneMobileIcon,
//       // items: [
//       //   {
//       //     label: "Cores",
//       //     to: "/cores",
//       //   },
//       //   {
//       //     label: "Pagina inicial",
//       //     to: "/landing-page",
//       //   },
//       // ],
//     },
//     {
//       label: "Finanças",
//       icon: CurrencyDollarIcon,
//       ref: "financasRef",

//       items: [
//         {
//           label: "Contas a pagar",
//           to: "/contas",
//         },
//         {
//           label: "Relatórios",
//           to: "/relatorio",
//         },
//         {
//           label: "Movimentações",
//           to: "/movimentacoes",
//         },
//       ],
//     },
//     {
//       label: "Estoque",
//       icon: ShoppingBagIcon,
//       ref: "stockRef",
//       items: [
//         {
//           label: "Produtos",
//           to: "/produtos",
//         },
//         {
//           label: "Movimentações",
//           to: "/movimentacao-produtos",
//         },
//       ],
//     },
//     // {
//     //   to: "",
//     //   label: "Estoque",
//     //   icon: ShoppingBagIcon,
//     // },
//   ];
//   // if (user.isWorker) {
//   //   return routes.filter((route) => !routesToRestrict.includes(route.label));
//   // }
//   return routes;
// });
export const useDrawer = defineStore("drawer", {
  state: () => ({
    active: false,
    selectedGame,
    toggledBar: false,
    // routes,
  }),
  actions: {
    toggleActive() {
      this.active = !this.active;
    },
  },
  persist: true,
});
