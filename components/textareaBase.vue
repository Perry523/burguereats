<template>
  <div :class="`form-control w-full ${containerStyle} `">
    <div class="text-sm mb-1">
      <div
        :class="
          error ? 'text-error' : `label-text text-base-content ${labelStyle}`
        "
        >{{ label }}</div
      >
    </div>
    <textarea
      v-if="!isCurrency"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      @input="updateValue"
      class="textarea textarea-bordered w-full bordered"
      :class="error ? 'textarea-error ' : `${color} ${bgColor}`"
      v-maska
      :data-maska="mask"
      :data-tokens="tokens"
      :data-maska-reversed="reversed"
      :data-maska-eager="eager"
    >
    </textarea>
    <currency v-else />
    <div class="text-error text-xs" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MaskTokens, MaskType } from "maska";

const props = defineProps({
  label: String,
  labelStyle: String,
  type: {
    type: String,
    default: "text",
  },
  containerStyle: String,
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
  updateType: String,
  color: {
    type: String,
    default: "base-content",
  },
  bgColor: {
    type: String,
    default: "base-100",
  },
  isCurrency: { type: Boolean },
  // to use mask
  mask: { type: String as () => MaskType },
  tokens: { type: Object as () => MaskTokens },
  tokensReplace: { type: Boolean },
  eager: { type: Boolean },
  reversed: { type: Boolean },
});

const emit = defineEmits(["update:value"]);
const value = ref(props.value);
function updateValue(e: Event) {
  const target = e.target as HTMLInputElement
  value.value = target.value;
  emit("update:value", value.value);
}
</script>
