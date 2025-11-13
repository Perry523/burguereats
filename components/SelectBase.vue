<template>
  <div class="h-full">
    <select
      v-model="modelValue"
      class="text-left select bordered w-full"
      :placeholder
      :class="[inputStyle, inputClasses, bordered && ' input-bordered']"
    >
      <option
        v-for="(opt, i) in options"
        :key="i"
        :value="getValue(opt as object)"
      >
        {{ getLabel(opt as object) }}
      </option>
    </select>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  options: { type: Array },
  placeholder: { type: String },
  bordered: { type: Boolean, default: true },
  inputStyle: { type: String, default: "" },
  inputClasses: { type: String },
  optionLabel: { type: String, default: undefined },
  optionValue: { type: String, default: undefined },
  initialValue: { type: [String, Number] },
});
// const value = ref(props.initialValue);
const modelValue = defineModel();
function getValue(opt: object) {
  return props.optionValue ? opt[props.optionValue as keyof object] : opt;
}
function getLabel(opt: object) {
  return props.optionLabel ? opt[props.optionLabel as keyof object] : opt;
}
// const emit = defineEmits(["update:modelValue", "update:value"]);
// function updateValue(e: Event) {
// const target = e.currentTarget as HTMLInputElement;
// value.value = target.value;
// emit("update:modelValue", modelValue.value);
// emit("update:value", modelValue.value);
// }
</script>
