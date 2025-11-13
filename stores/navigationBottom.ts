import {
  CalendarDaysIcon,
  CameraIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/solid";
import { defineStore } from "pinia";
import { computed } from "vue";
export type Routes = {
  to: string;
  label: string;
  icon: typeof CurrencyDollarIcon | string;
};
const routes = computed(() => {
  const routes: Routes[] = [
    {
      to: "/",
      label: "Dashboard",
      icon: ChartPieIcon,
    },
    {
      to: "/instagram-connection",
      label: "Instagram",
      icon: CameraIcon,
    },
    {
      to: "/ai-content",
      label: "IA Content",
      icon: WrenchScrewdriverIcon,
    },
    {
      to: "/clientes",
      label: "Clientes",
      icon: UserCircleIcon,
    },
    {
      to: "/relatorio",
      label: "Relatórios",
      icon: CurrencyDollarIcon,
    },
    {
      to: "/config",
      label: "Config",
      icon: CalendarDaysIcon,
    },
  ];

  return routes;
});
export const useNavigationBottom = defineStore("navigationBottom", {
  state: () => ({
    active: false,
    routes,
  }),
  actions: {
    toggleActive() {
      this.active = !this.active;
    },
  },
  persist: true,
});
