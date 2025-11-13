<template>
  <div class="btm-nav flex">
    <button
      v-for="{ icon, to, label } in routes"
      :key="to"
      :class="
        to === route.path
          ? 'active bg-red-600 border-red-600 text-white'
          : 'bg-base-200'
      "
      class="relative"
      @click="router.push(to as string)"
    >
      <component
        :class="to === route.path ? 'fill-white' : ''"
        :is="icon"
        class="w-5 h-5"
      ></component>
      <span class="text-xs">{{ label }}</span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { type Routes } from "~/stores/drawer";
import {
  CalendarDaysIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/vue/24/solid";

const routes: Routes[] = [
  {
    to: "/atendimento",
    label: "Atendimento",
    icon: WrenchScrewdriverIcon,
  },
  {
    to: "/agenda",
    label: "Agenda",
    icon: CalendarDaysIcon,
  },
  {
    to: "/historico",
    label: "Histórico",
    icon: CurrencyDollarIcon,
  },
  {
    to: "/dashboard",
    label: "Faturamento",
    icon: ChartPieIcon,
  },
  {
    to: "/perfil",
    label: "Perfil",
    icon: UserCircleIcon,
  },
];

const router = useRouter();
const route = useRoute();
</script>
