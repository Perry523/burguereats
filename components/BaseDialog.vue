<template>
  <ClientOnly>
    <Teleport to="html">
      <div
        :class="{ 'modal-open': modelValue, 'modal-lg': large }"
        class="modal"
      >
        <div
          class="modal-box overflow-y-auto overflow-x-hidden relative sm:rounded-lg"
          :class="{ 'slide-up': modelValue }"
        >
          <div v-if="title" class="text-xl sm:text-2xl text-center -mt-1 mb-2">
            {{ title }}
          </div>
          <div
            @click="emit('update:modelValue', false)"
            class="fixed z-20 right-0 top-0 text-xl cursor-pointer"
          >
            <XCircleIcon class="w-9 h-9" />
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
});
const emit = defineEmits(["update:modelValue", "close"]);
</script>
<style lang="scss">
.modal-lg {
  .modal-box {
    max-width: 44rem;
  }
}
.modal {
  display: flex;
  justify-content: center;

  .modal-box {
    transform: translateY(100%);
    transition: transform 0.25s ease-out;

    &.slide-up {
      transform: translateY(0);
    }

    @media (max-width: 640px) {
      width: 100%;
      min-height: 100svh;
      margin: 0;
      border-radius: 0;
      align-items: flex-end;
    }
  }
}

html {
  scrollbar-gutter: auto !important;
}
</style>
