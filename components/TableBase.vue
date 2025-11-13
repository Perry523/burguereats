<template>
  <div class="h-full flex flex-col w-full">
    <div class="">
      <div class="flex justify-between items-center">
        <slot name="filter">
          <div class="flex items-center">
            <div />
          </div>
        </slot>
        <slot name="create-button" v-if="!noCreate">
          <base-button class="" @click="emit('new')">
            Novo
          </base-button>
        </slot>
      </div>
      <div class="relative w-full h-3 overflow-hidden">
        <hr class="mt-1 border-base-200 -mb-[2px] sm:mt-1" />
        <div
          v-if="loading"
          class="absolute w-full h-[2px] bg-primary animate-loading"
        ></div>
      </div>
    </div>
    <div class="overflow-auto">
      <table class="table table-sm w-full">
        <thead>
          <tr>
            <th v-if="select" class="w-14">
              <label>
                <input
                  type="checkbox"
                  class="checkbox"
                  v-model="tableSelect"
                  @change="togleAll"
                />
              </label>
            </th>
            <th
              v-for="{ label, sm, center } in columns"
              :class="[
                sm ? '' : 'hidden sm:table-cell',
                center ? 'text-center' : 'text-left',
              ]"
              :key="label"
            >
              {{ label }}
            </th>
            <th class="w-10 sm:w-24" v-if="!hideActions">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr class="w-full"></tr>
          <tr v-for="(item, index) in paginatedRows" :key="index">
            <td v-if="select">
              <input
                type="checkbox"
                class="checkbox"
                @change="toggleSelection(item)"
                :checked="selectedIds.includes(item.id)"
              />
            </td>
            <td
              :class="sm ? '' : 'hidden sm:table-cell'"
              v-for="({ key, type, sm }, index) in columns"
              :key="key + index"
            >
              <slot :value="item[key]" :row="item" :name="key">
                <div v-if="type === 'currency'">
                  {{ toBrl(item[key]) }}
                </div>
                <div v-else-if="type === 'date'">
                  {{ dayjs(item[key]).format("DD/MM/YYYY") }}
                </div>
                <div v-else-if="type === 'time'">
                  {{ dayjs(item[key]).format("DD/MM - HH:mm") }}
                </div>
                <div v-else>
                  <span>{{ item[key] }}</span>
                </div>
              </slot>
            </td>
            <slot name="actions" :value="item">
              <td v-if="!hideActions" class="px-0">
                <div class="dropdown">
                  <div
                    @click="dropdown = !dropdown"
                    role="button"
                    class="btn btn-sm m-1"
                    tabindex="0"
                  >
                    <EllipsisVerticalIcon class="w-5" />
                  </div>
                  <ul
                    v-if="dropdown"
                    tabindex="0"
                    class="dropdown-content text-base !fixed right-4 md:right-16 menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
                  >
                    <li v-if="!hideEdit" @click="emit('edit', item)">
                      <a>Editar</a>
                    </li>
                    <li v-if="!hideDelete" @click="emit('delete', item)">
                      <a>Excluir</a>
                    </li>

                    <li
                      v-for="action in props.actions"
                      :key="action.name"
                      @click="action.action(item)"
                    >
                      <a>{{ action.name }}</a>
                    </li>
                    <slot name="additional-actions" :item="item" />
                  </ul>
                </div>
              </td>
            </slot>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-auto min-h-12 flex justify-end items-center overflow-hidden">
      <div class="flex items-center gap-2">
        <select class="select select-bordered select-xs sm:select-sm" v-model="perPage">
          <option
            v-for="option in [5, 10, 15, 20]"
            :key="option"
            :value="option"
          >
            {{ option }} por página
          </option>
        </select>
        <div class="flex items-center">
          <button
            class="btn btn-xs sm:btn-sm"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="changePage(1)"
            v-if="currentPage !== 1"
          >
            «
          </button>
          <button
            class="btn btn-xs sm:btn-sm"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="changePage(currentPage - 1)"
            v-if="currentPage !== 1"
          >
            ‹
          </button>
          <button
            v-for="page in computedVisiblePages"
            :key="page"
            class="btn btn-xs sm:btn-sm"
            :class="{ 'btn-primary rounded-full': page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="btn btn-xs sm:btn-sm btn-ghost sm:text-xl text-gray-700"
            :class="currentPage === totalPages ? 'btn-disabled hidden' : 'btn'"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            ›
          </button>
          <button
            class="btn btn-xs sm:btn-sm btn-ghost sm:text-xl text-gray-700"
            :class="{ 'btn-disabled hidden': currentPage === totalPages }"
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon } from "@heroicons/vue/24/solid";
import dayjs from "dayjs";
import { toBrl } from "#build/imports";
import { onMounted, onUnmounted } from "vue";
const dropdown = ref(false);
const tableSelect = ref(false);
const selecteds = ref<Row[]>([]);
const isMobile = ref(false);

const props = defineProps({
  columns: {
    type: Array as () => {
      key: string;
      label: string;
      type?: string;
      sm?: boolean;
      center?: boolean;
    }[],
    required: true,
  },
  actions: {
    type: Array as () => {
      name: string;
      action: (item: Row) => void;
    }[],
    default: () => [],
  },

  rows: {
    type: Array as () => Row[],
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  hideActions: {
    type: Boolean,
    default: false,
  },
  hideEdit: {
    type: Boolean,
    default: false,
  },
  hideDelete: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  noCreate: {
    type: Boolean,
    default: false,
  },
  select: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
});
const perPage = defineModel<number>("per_page", { default: 10 });
const currentPage = defineModel("page", { default: 1 });

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    emit("paginate", { page, perPage: perPage.value });
  }
};

// const changePerPage = (e) => {
// currentPage.value = 1; // Reseta para a primeira página ao mudar perPage
// };
const emit = defineEmits([
  "new",
  "edit",
  "delete",
  "update:selecteds",
  "paginate",
]);

interface Row {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const totalPages = computed(() => Math.ceil(props.totalItems / perPage.value));
const paginatedRows = computed(() => {
  // Since pagination is handled server-side, return all rows
  return props.rows;
});

// function goToPage(page: number) {
//   currentPage.value = page;
//   emit("paginate", { page, perPage: perPage.value.value });
// }
const selectedIds = computed(() => selecteds.value.map((item) => item.id));
function togleAll() {
  if (tableSelect.value) {
    const payload = [...props.rows];
    selecteds.value = payload;
  } else {
    selecteds.value = [];
  }
}
function toggleSelection(item: Row) {
  const index = selectedIds.value.indexOf(item.id);
  if (index === -1) {
    const newArray = [...selecteds.value, item];
    selecteds.value = newArray;
  } else {
    const newArray = [...selecteds.value];
    newArray.splice(index, 1);
    selecteds.value = newArray;
  }
}
watch(
  () => selecteds.value,
  (value) => {
    if (value.length === props.rows.length) {
      tableSelect.value = true;
    } else {
      tableSelect.value = false;
    }
    emit("update:selecteds", value);
  }
);
watch(
  () => perPage.value,
  () => {
    currentPage.value = 1;
    emit("paginate", { page: 1, perPage: perPage.value });
  }
);
const computedVisiblePages = computed(() => {
  if (totalPages.value === 0) {
    return [];
  }

  const pages = [];
  const maxVisible = isMobile.value ? 3 : 5; // Show fewer pages on mobile
  const sidePages = Math.floor(maxVisible / 2);

  let start = currentPage.value - sidePages;
  let end = currentPage.value + sidePages;

  if (start < 1) {
    end += 1 - start;
    start = 1;
  }
  if (end > totalPages.value) {
    start -= end - totalPages.value;
    end = totalPages.value;
  }
  start = Math.max(start, 1);
  end = Math.min(end, totalPages.value);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Handle mobile detection
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 640;
  };

  checkMobile();
  window.addEventListener('resize', checkMobile);

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
  });
});
</script>
<style>
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.animate-loading {
  animation: loading 2s linear infinite;
}
</style>
