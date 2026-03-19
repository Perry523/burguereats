<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="modelValue"
        :class="{ 'modal-lg': large, 'modal-xl': extraLarge }"
        class="modal modal-open"
      >
        <div
          class="modal-box overflow-y-auto overflow-x-hidden relative sm:rounded-lg slide-up"
        >
          <div v-if="title" class="text-xl sm:text-2xl text-center -mt-1 mb-2">
            {{ title }}
          </div>
          <div
            @click="emit('update:modelValue', false)"
            class="absolute z-20 right-4 top-4 text-xl cursor-pointer"
          >
            <XCircleIcon class="w-9 h-9 text-gray-400 hover:text-gray-600 transition-colors" />
          </div>
          <slot name="default" />
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>
<script setup lang="ts">
import { XCircleIcon } from "@heroicons/vue/24/solid";
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: undefined,
  },
  large: {
    type: Boolean,
    default: false,
  },
  extraLarge: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue", "close"]);
</script>
<style lang="scss">
.modal {
  display: flex !important;
  justify-content: center;
  align-items: center; /* Center vertically on desktop */
  background-color: rgba(0, 0, 0, 0.5); /* Fixed backdrop */
  z-index: 9999;
  position: fixed;
  inset: 0;

  .modal-box {
    animation: slide-up 0.25s ease-out;
    background-color: white;
    max-height: 90vh; /* Prevent it from overflowing screen height */
    width: 91.666667%; /* Default modal width */
    max-width: 32rem;

    @media (max-width: 640px) {
      width: 100% !important;
      min-height: 100svh !important;
      max-height: 100svh !important;
      margin: 0 !important;
      border-radius: 0 !important;
      padding-top: 3.5rem !important; /* Space for X button */
    }
  }
}

.modal-lg .modal-box {
  max-width: 44rem;
}

.modal-xl .modal-box {
  max-width: 56rem;
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

html {
  scrollbar-gutter: auto !important;
}
</style>
