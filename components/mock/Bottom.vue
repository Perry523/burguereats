<template>
  <div :style="`background: ${cardsColor}`" class="h-16 w-full mt-auto">
    <div class="h-16 items-center justify-around flex">
      <button
        v-for="{ icon, label } in routes"
        :key="label"
        :style="
          label === 'Agendar'
            ? `background: ${buttonsColor}; border-top: 3px solid ${contrastPrimary ? '#fff' : '#000'}; color: ${contrastPrimary ? '#fff' : '#000'}`
            : ''
        "
        class="relative h-full basis-full flex flex-col items-center justify-center"
      >
        <component :is="icon" class="w-5 h-5"></component>
        <span class="text-xs">{{ label }}</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  BookmarkSquareIcon,
  ScissorsIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/vue/24/solid";
const routes = [
  {
    label: "Agendar",
    icon: ScissorsIcon,
  },
  {
    label: "Pedidos",
    icon: BookmarkSquareIcon,
  },
  {
    label: "Perfil",
    icon: UserIcon,
  },
  {
    label: "Carrinho",
    icon: ShoppingCartIcon,
  },
];
const props = defineProps({
  buttonsColor: String,
  cardsColor: String,
  contrastText: Number,
});
function getContrastColor(hex: string): number {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 130 ? 0 : 1;
}
const contrastPrimary = computed(() =>
  props.buttonsColor ? getContrastColor(props.buttonsColor) : 0
);
</script>
