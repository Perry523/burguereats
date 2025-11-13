<template>
  <button
    class="btn"
    :class="`btn-${color} btn-${size}`"
    :disabled="!!loading || disabled"
  >
    <div class="flex items-center">
      <div v-if="!!loading" class="loading loading-spinner text-neutral mr-2"></div>
      <slot />
    </div>
  </button>
</template>

<script setup type="ts">
defineProps({
  color: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
