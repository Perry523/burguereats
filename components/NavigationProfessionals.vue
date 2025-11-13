<template>
  <div class="btm-nav flex">
    <button
      v-for="({ icon, to, label }, i) in navigationBottom.routes"
      :key="i"
      :class="to === route.path ? 'active-navigation' : 'bg-base-200'"
      class="relative px-1"
      @click="router.push(to)"
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
import { useNavigationBottom } from "~/stores/navigationBottom";
const navigationBottom = useNavigationBottom();
const router = useRouter();
const route = useRoute();
</script>
<style lang="scss">
.active-navigation {
  @apply active bg-red-600 border-red-600 text-white;
}
</style>
