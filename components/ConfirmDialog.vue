<template>
  <base-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', false)"
    :title="message"
  >
    <div class="w-full flex mt-12">
      <div class="m-auto space-x-4">
        <base-button @click="confirm">Confirmar</base-button>
        <base-button @click="emit('update:modelValue', false)" color="error">
          Cancelar
        </base-button>
      </div>
    </div>
  </base-dialog>
</template>

<script setup lang="ts">
defineProps({
  message: {
    type: String,
    default: "Você deseja continuar?",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

function confirm() {
  emit("update:modelValue", false);
  emit("confirm");
}

const emit = defineEmits(["confirm", "update:modelValue"]);
</script>
