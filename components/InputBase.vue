<template>
  <div :class="`form-control w-full`">
    <label
      :for="label"
      :class="[
        error ? 'text-error' : `label-text text-base-content mb-1`,
        labelStyle,
      ]"
      class="text-sm"
      v-if="!hideLabel"
    >
      <slot name="label">
        <span class="bg-base-100">
          {{ label }}
        </span>
      </slot>
    </label>
    <div class="relative h-full">
      <currency
        v-if="isCurrency"
        v-model="modelValue"
        :class="[
          error ? 'input-error ' : `${color} ${bgColor}`,
          bordered && 'input-bordered',
          inputStyle,
          inputClasses,
        ]"
        @focusout="emit('focusout')"
      />
      <!-- < packs - auto - complete - select
      v -else -if=" isAutoComplete" v-bind="config" :inputStyle="inputStyle" :selected="itemsSelected"
        :items="itemsToSelected" @update:selected="updateSelected" /> -->
      <select-base
        :id="label"
        v-else-if="isSelect"
        :inputStyle
        :value
        :bordered
        :initial-value="value"
        :options
        :optionLabel
        :optionValue
        :placeholder
        :inputClasses
        v-model="modelValue"
        @update:modelValue="updateModel"
        :class="[
          error ? 'input-error ' : `${color} ${bgColor}`,
          bordered && 'input-bordered',
          inputStyle,
        ]"
        class="w-full !text-left"
      />
      <textarea
        :id="label"
        v-else-if="type === 'textarea'"
        class="textarea textarea-bordered w-full"
        v-model="modelValue"
        :class="[
          error ? 'input-error ' : `${color} ${bgColor}`,
          bordered && 'textarea-bordered',
          inputStyle,
          inputClasses,
        ]"
        :disabled="disabled"
        :readonly="readonly"
      />
      <input
        :id="label"
        v-else
        v-maska
        :data-maska="dataMaska"
        @maska="handleMask"
        v-model="maskedValue"
        class="input w-full bordered"
        :class="[
          error ? 'input-error ' : `${color} ${bgColor}`,
          bordered && 'input-bordered',
          inputStyle,
          inputClasses,
        ]"
        :placeholder
        :type
        :disabled
        :readonly
        @focusout="emit('focusout')"
      />
      <slot name="append" />
    </div>
    <div class="text-error text-xs" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type MaskaDetail, type MaskType } from "maska";
const modelValue = defineModel<string | number>();
const props = defineProps({
  label: String,
  labelStyle: String,
  classes: String,
  type: {
    type: String,
    default: "text",
  },
  size: {
    type: String,
    default: "md",
  },

  value: {
    type: [String, Number],
  },
  error: {
    default: undefined,
    type: String,
  },
  placeholder: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "base-content",
  },
  bgColor: {
    type: String,
    default: "base-100",
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  hideLabel: {
    type: Boolean,
    default: false,
  },
  min: {
    type: [String, Number],
  },
  max: {
    type: [String, Number],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  isCurrency: { type: Boolean },
  options: { type: Array },
  itemsSelected: { type: Object },
  itemsToSelected: { type: Object },
  dataMaska: { type: String as () => MaskType },
  unmasked: { type: String as () => MaskType },
  dataMaskaReversed: { type: Boolean },
  inputClasses: { type: String },
  optionLabel: { type: String, default: "label" },
  optionValue: { type: String, default: "value" },
});
const inputStyle = computed(() => {
  const prefix = isSelect.value ? "select" : "input";
  return `${prefix}-${props.size} `;
});

// const isAutoComplete = computed(() => !!props.itemsSelected); // Use !! to convert to a boolean value
const isSelect = computed(() => !!props.options?.length); // Use !! to convert to a boolean value

const emit = defineEmits(["update:modelValue", "update:selected", "focusout"]);

const maskedValue = ref(modelValue.value);
function handleMask(e: CustomEvent<MaskaDetail>) {
  modelValue.value = e.detail.unmasked;
}
watch(modelValue, (val) => {
  if (!props.dataMaska || !maskedValue.value) maskedValue.value = val;
});
function updateModel(e: string) {
  emit("update:modelValue", e);
}
</script>
