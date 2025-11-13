<template>
  <div :style="`background: ${cardsColor}`" class="h-12 w-full pr-2">
    <div class="flex w-full justify-between items-center">
      <nuxt-img
        loading="lazy"
        class="w-12 h-12"
        :src="image"
        alt="Profile image"
      />
      <ShoppingCartIcon
        :class="contrastText ? 'text-white' : 'text-black'"
        class="w-6 h-6"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ShoppingCartIcon } from "@heroicons/vue/24/solid";

defineProps({
  image: String,
  cardsColor: String,
  contrastText: Number,
});
</script>
