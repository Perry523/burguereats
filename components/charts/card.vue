<template>
  <div
    class="elevated-card w-full px-3 py-2 sm:px-5 sm:py-3 col-span-1 max-w font-semibold sm:text-lg bg-base-200 flex">
    <div class="border-b-[1px] border-gray-400">
      {{ title }}:
    </div>
    <div
      :class="{ 'text-red-600': (negative || !isProfit) && value !== 0, 'text-green-600': isProfit && !negative && value !== 0 }">
      {{ toBrl(value) }}
    </div>
  </div>

</template>
<script setup lang="ts">
const props = defineProps(["value", "title", "negative"]);
const isProfit = computed(() => props.value > 0);
</script>
