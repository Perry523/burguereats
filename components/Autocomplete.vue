<template>
  <div class="relative form-control">
    <label class="text-sm mb-1" :class="labelStyle">
      {{ label }}
    </label>
    <div ref="componentRef" class="w-full">
      <input v-model="text" class="input w-full bordered" :class="[
        error ? 'input-error ' : `${color} ${bgColor}`,
        bordered && 'input-bordered',
        inputClasses,
      ]" :disabled="disabled" :readonly="readonly" @click="() => { openedDropdown = true; updateDropdownPosition() }"
        @focus="focused = true" @blur="handleBlur" @input="handleInput" v-maska :data-maska="mask" />
      <div class="text-error text-xs" v-if="error">
        <div class="flex items-center justify-between" v-if="error === 'required_custom'">
          <template v-if="text?.length">
            <div>
              {{ text }} não encontrado
            </div>
            <button class="btn btn-primary z-50 btn-sm mt-1" @click="emit('create', text)">
              Cadastrar
            </button>
          </template>
          <template v-else>
            <div>
              Campo obrigatório
            </div>
            <!-- <button class="btn btn-primary z-50 btn-sm mt-2" @click="emit('create', text)">
              Criar novo
            </button> -->
          </template>
        </div>
        <div v-else>
          {{ error }}
        </div>
      </div>
      <Teleport to="body">
        <ul class="menu fixed z-[9999] flex-nowrap w-full overflow-auto dropdown-content bg-base-100 rounded-box p-2 shadow"
          :style="dropdownStyle" v-if="isDropdownOpen">
          <template v-if="loading">
            <li class="flex items-center justify-center py-2">
              <div class="loading loading-spinner loading-sm"></div>
            </li>
          </template>
          <template v-else-if="
            showDropdown && !filteredOptions.length
          ">
            <div class="text-center z-50 flex items-center justify-between">
              <p class="text-gray-500">Nenhum resultado</p>
              <button v-if="createRegister" class="btn btn-primary z-50 btn-sm mt-2" @click="emit('create', text)">
                Criar novo
              </button>
            </div>
          </template>
          <template v-else>
            <li v-for="(option, i) in filteredOptions" :key="i" @mousedown.prevent="handleSelect(option as any)">
              <a>
                {{ props.textOnly ? option : option[props.optionLabel] }}
              </a>
            </li>
          </template>
        </ul>
      </Teleport>
    </div>
  </div>
</template>
<script setup lang="ts">
import { vMaska } from "maska";
const focused = ref(false);
const modelValue = defineModel();
const text = ref();
const showNoResults = ref(false);
const isSelectingFromDropdown = ref(false);
const dropdownPosition = ref({
  top: 0,
  left: 0,
  width: 0,
});

function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  text.value = value;
  if (!isSelectingFromDropdown.value) {
    emit("input", value);
  }
}

function handleBlur() {
  // Small delay to allow click events to fire first
  setTimeout(() => {
    focused.value = false;
    openedDropdown.value = false;
  }, 200);
}

function handleSelect(option: { label: string; id: string }) {
  isSelectingFromDropdown.value = true;
  if (props.getId) modelValue.value = option.id;
  else if (props.textOnly) modelValue.value = option;
  else if (props.returnObject) modelValue.value = option;
  else modelValue.value = option[props.optionValue];
  text.value = props.textOnly ? option : option[props.optionLabel];
  openedDropdown.value = false;
  showNoResults.value = false;
  // Reset the flag after a short delay to allow the text change to propagate
  nextTick(() => {
    isSelectingFromDropdown.value = false;
  });
}
function updateDropdownPosition() {
  if (componentRef.value) {
    const rect = componentRef.value.getBoundingClientRect();
    const isMobile = window.innerWidth < 640;
    const errorHeight = props.error ? text.value?.length ? 34 : 16 : 0;
    if (isMobile) {
      dropdownPosition.value = {
        top: rect.bottom + window.scrollY - errorHeight,
        left: rect.left + window.scrollX,
        width: rect.width,
      };
    } else {
      dropdownPosition.value = {
        top: rect.bottom + window.scrollY - errorHeight,
        left: rect.left + window.scrollX,
        width: rect.width,
      };
    }
  }
}
const isDropdownOpen = computed(() => {
  return (
    openedDropdown.value &&
    focused.value &&
    (props.loading || props.options?.length || text.value?.length || props.createRegister)
  );
});
const componentRef = ref<HTMLElement | null>(null);
const openedDropdown = ref(true);
const props = defineProps({
  error: {
    default: undefined,
    type: String,
  },
  color: {
    type: String,
    default: "base-content",
  },
  label: {
    type: String,
    default: "",
  },
  labelStyle: {
    type: String,
    default: "",
  },
  bgColor: {
    type: String,
    default: "base-100",
  },
  textOnly: {
    type: Boolean,
    default: false,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  inputClasses: { type: String },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  getId: {
    type: Boolean,
    default: false,
  },
  returnObject: {
    type: Boolean,
    default: false,
  },
  forceOpen: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Array as PropType<{ [key: string]: any }[]>,
    default: () => [],
  },
  optionLabel: { type: String, default: "label" },
  optionValue: { type: String, default: "id" },
  mask: { type: String },
  maskaTokens: { type: Object },
  createRegister: { type: Boolean, default: true },
});

const dropdownStyle = computed(() => ({
  top: dropdownPosition.value.top + "px",
  left: dropdownPosition.value.left + "px",
  width: dropdownPosition.value.width + "px",
  maxHeight: "200px",
  // overflowY: "auto",
}));

watch(
  () => props.options,
  () => {
    openedDropdown.value = true;
    nextTick(() => {
      updateDropdownPosition();
    });
  },
  { deep: true }
);
watch(isDropdownOpen, (newVal) => {
  if (newVal) {
    updateDropdownPosition();
  }
});

watch(
  () => text.value,
  (newVal) => {
    if (newVal !== undefined) {
      nextTick(() => {
        updateDropdownPosition();
      });
      showNoResults.value = true;
    }
  }
);

onMounted(() => {
  setTimeout(() => {
    openedDropdown.value = false;
  });
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("scroll", updateDropdownPosition);
  window.addEventListener("resize", updateDropdownPosition);
  nextTick(() => {
    updateDropdownPosition();
  });

  // Set initial text value if modelValue exists
  if (modelValue.value) {
    if (props.textOnly) {
      text.value = modelValue.value;
    } else if (props.options.length > 0) {
      let option;
      if (props.returnObject && typeof modelValue.value === 'object' && modelValue.value !== null) {
        // If returnObject is true and modelValue is an object, use it directly
        option = modelValue.value as Record<string, unknown>;
      } else if (typeof modelValue.value === 'object' && modelValue.value !== null && (modelValue.value as Record<string, unknown>)[props.optionValue]) {
        // If modelValue is an object, compare by the optionValue property
        option = props.options.find(
          (option) => option[props.optionValue] === (modelValue.value as Record<string, unknown>)[props.optionValue]
        );
      } else {
        // If modelValue is a primitive value, compare directly
        option = props.options.find(
          (option) => option[props.optionValue] === modelValue.value
        );
      }
      if (option) {
        isSelectingFromDropdown.value = true;
        text.value = option[props.optionLabel];
        nextTick(() => {
          isSelectingFromDropdown.value = false;
        });
      }
    }
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("scroll", updateDropdownPosition);
  window.removeEventListener("resize", updateDropdownPosition);
});

function handleClickOutside(event: MouseEvent) {
  if (
    componentRef.value &&
    !componentRef.value.contains(event.target as Node)
  ) {
    console.log("click outside");
    openedDropdown.value = false;
  }
}
const removeAccents = (str: string) =>
  str?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "");

const filteredOptions = computed(() => {
  console.log("text", text.value);
  if (!text.value && !focused.value) return [];

  const filtered = props.options.filter((option) => {
    const normalizedText = removeAccents(text.value?.toLowerCase() || "");
    console.log("normalizedText", normalizedText);
    const normalizedOption = removeAccents(option[props.optionLabel]?.toLowerCase() || "");
    console.log("normalizedOption", option);
    return normalizedOption.includes(normalizedText);
  });
  console.log("filtered", filtered);
  if (filtered.length > 7) return filtered.slice(0, 6);
  else return filtered;
});

const emit = defineEmits(["input", "create"]);

// onMounted(() => {
//   setTimeout(() => {
//     if (props.textOnly && modelValue.value) text.value = modelValue.value;
//     else if (modelValue.value) {
//       // @ts-expect-error: modelValue.value is a string
//       text.value = modelValue.value.name;
//       console.log("text", text.value);
//     }
//   }, 10);
// });
const showDropdown = computed(() => (showNoResults.value || props.createRegister) && !filteredOptions.value.length);

watch(
  showDropdown,
  () => {
    updateDropdownPosition();
  },
);
watch(modelValue, (val) => {
  if (props.textOnly) {
    text.value = val;
  } else if (val && props.options.length > 0) {
    // Find the option that matches the modelValue and set the text
    let option;
    if (props.returnObject && typeof val === 'object' && val !== null) {
      // If returnObject is true and modelValue is an object, use it directly
      option = val as Record<string, unknown>;
    } else if (typeof val === 'object' && val !== null && (val as Record<string, unknown>)[props.optionValue]) {
      // If modelValue is an object, compare by the optionValue property
      option = props.options.find(
        (option) => option[props.optionValue] === (val as Record<string, unknown>)[props.optionValue]
      );
    } else {
      // If modelValue is a primitive value, compare directly
      option = props.options.find(
        (option) => option[props.optionValue] === val
      );
    }
    if (option) {
      isSelectingFromDropdown.value = true;
      text.value = option[props.optionLabel];
      nextTick(() => {
        isSelectingFromDropdown.value = false;
      });
    }
  }
  nextTick(() => {
    updateDropdownPosition();
  });
});

// Watch for changes in options to update text when options are loaded
watch(
  () => props.options,
  (newOptions) => {
    if (modelValue.value && newOptions.length > 0 && !text.value) {
      // If we have a modelValue but no text, try to find the matching option
      let option;
      if (props.returnObject && typeof modelValue.value === 'object' && modelValue.value !== null) {
        // If returnObject is true and modelValue is an object, use it directly
        option = modelValue.value as Record<string, unknown>;
      } else if (typeof modelValue.value === 'object' && modelValue.value !== null && (modelValue.value as Record<string, unknown>)[props.optionValue]) {
        // If modelValue is an object, compare by the optionValue property
        option = newOptions.find(
          (option) => option[props.optionValue] === (modelValue.value as Record<string, unknown>)[props.optionValue]
        );
      } else {
        // If modelValue is a primitive value, compare directly
        option = newOptions.find(
          (option) => option[props.optionValue] === modelValue.value
        );
      }
      if (option) {
        isSelectingFromDropdown.value = true;
        text.value = option[props.optionLabel];
        nextTick(() => {
          isSelectingFromDropdown.value = false;
        });
      }
    }
  },
  { deep: true, immediate: true }
);
</script>
