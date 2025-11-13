<template>
  <input @focusout="$emit('focusout')" ref="inputRef" type="text" class="input input-bordered w-full" />
</template>

<script setup lang="ts">
import { useCurrencyInput } from "vue-currency-input";
const props = defineProps(["options"]);
const defaltValues = {
  currency: "BRL",
  locale: "pt-BR",
  autoDecimalDigits: true,
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  valueRange: { min: 0 },
};
const modelValue = defineModel<number>();
const options = { ...defaltValues, ...props?.options };
const { inputRef, setValue, numberValue } = useCurrencyInput(options);
watch(numberValue, (newValue) => {
  if (newValue === null) setValue(0);
});

watch(inputRef, () => {
  if (modelValue.value) setValue(modelValue.value);
  else setValue(0);
});
watch(modelValue, (val) => {
  if (val) setValue(val);
});
defineEmits(['focusout'])
</script>
