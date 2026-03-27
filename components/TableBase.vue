<template>
  <div class="h-full flex flex-col w-full">
    <div class="">
      <div class="flex justify-between items-center">
        <slot name="filter">
          <div class="flex items-center">
            <div />
          </div>
        </slot>
        <!-- <slot name="create-button" v-if="!noCreate">
          <base-button class="" @click="emit('new')">
            Novo
          </base-button>
        </slot> -->
      </div>
      <div class="relative w-full h-3 overflow-hidden">
        <hr class="mt-1 border-base-200 -mb-[2px] sm:mt-1" />
        <div
          v-if="loading"
          class="absolute w-full h-[2px] bg-primary animate-loading"
        ></div>
      </div>
    </div>
    <div class="overflow-auto flex-1 bg-white">
      <table class="min-w-full divide-y divide-gray-200 relative">
        <thead class="bg-gray-50 sm:bg-gray-100 sticky top-0 z-10 shadow-sm">
          <tr>
            <th
              v-if="select"
              class="w-10 sm:w-14 px-3 py-1 md:py-2.5 sm:px-6 sm:py-4"
            >
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
                'px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800',
              ]"
              :key="label"
            >
              {{ label }}
            </th>
            <th
              class="px-4 py-3 sm:px-6 sm:py-4 text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 sm:text-gray-800 w-10 sm:w-24"
              v-if="!hideActions"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="(item, index) in paginatedRows"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td
              v-if="select"
              class="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap"
            >
              <input
                type="checkbox"
                class="checkbox"
                @change="toggleSelection(item)"
                :checked="selectedIds.includes(item.id)"
              />
            </td>
            <td
              :class="[
                sm ? '' : 'hidden sm:table-cell',
                'px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-700',
              ]"
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
              <td
                v-if="!hideActions"
                class="px-2 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div class="relative inline-block text-left action-dropdown">
                  <div
                    role="button"
                    class="btn btn-sm btn-ghost m-1 p-1 hover:bg-gray-200"
                    @click.stop="toggleDropdown(index)"
                  >
                    <EllipsisVerticalIcon class="w-5 h-5 text-gray-500" />
                  </div>
                  <ul
                    v-if="activeDropdown === index"
                    class="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-white p-2 shadow-xl border border-gray-100 focus:outline-none space-y-1 text-left"
                    @click="activeDropdown = null"
                  >
                    <li v-if="!hideEdit" @click="emit('edit', item)">
                      <a
                        class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        <UIcon
                          name="i-heroicons-pencil-square"
                          class="w-5 h-5 text-gray-400"
                        />
                        Editar
                      </a>
                    </li>
                    <li v-if="!hideDelete" @click="emit('delete', item)">
                      <a
                        class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-150"
                      >
                        <UIcon
                          name="i-heroicons-trash"
                          class="w-5 h-5 text-red-500 hover:text-red-600"
                        />
                        Excluir
                      </a>
                    </li>

                    <li
                      v-for="action in props.actions"
                      :key="action.name"
                      @click="action.action(item)"
                    >
                      <a
                        class="flex items-center gap-3 text-base py-2.5 px-4 font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        {{ action.name }}
                      </a>
                    </li>
                    <slot name="additional-actions" :item="item" />
                  </ul>
                </div>
              </td>
            </slot>
          </tr>
          <tr v-if="rows.length === 0 && !loading">
            <td
              :colspan="
                columns.length + (select ? 1 : 0) + (hideActions ? 0 : 1)
              "
              class="px-6 py-12 text-center text-sm text-gray-500"
            >
              Nenhum registro encontrado
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="mt-auto flex flex-row items-center justify-between border-t border-gray-200 pt-2 pb-2 px-2 sm:pt-3 sm:pb-3 sm:px-6 gap-2"
    >
      <div
        class="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-gray-500 shrink-0"
      >
        <span class="hidden sm:inline">Exibir</span>
        <select
          class="rounded-lg border border-gray-300 bg-white px-1 sm:px-2 py-1 object-cover text-xs sm:text-sm shadow-sm hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-12 sm:w-20"
          v-model="perPage"
        >
          <option
            v-for="option in [5, 10, 15, 20]"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <span class="hidden sm:inline">por página</span>
      </div>

      <div
        class="flex flex-wrap flex-1 sm:flex-initial items-center justify-end gap-1"
      >
        <!-- Pagination controls layout natively rounded & beautiful -->
        <button
          class="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="changePage(1)"
        >
          <span class="sr-only">Primeira página</span>
          «
        </button>
        <button
          class="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <span class="sr-only">Página anterior</span>
          ‹
        </button>

        <button
          v-for="page in computedVisiblePages"
          :key="page"
          :class="[
            'inline-flex h-7 min-w-[28px] sm:h-8 sm:min-w-[32px] items-center justify-center rounded-lg px-2 text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
            page === currentPage
              ? 'bg-primary text-white border border-primary'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
          ]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          class="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <span class="sr-only">Próxima página</span>
          ›
        </button>
        <button
          class="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="changePage(totalPages)"
        >
          <span class="sr-only">Última página</span>
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EllipsisVerticalIcon } from "@heroicons/vue/24/solid";
import dayjs from "dayjs";
import { toBrl } from "#build/imports";
import { onMounted, onUnmounted } from "vue";
const tableSelect = ref(false);
const selecteds = ref<Row[]>([]);
const isMobile = ref(false);
const activeDropdown = ref<number | null>(null);

const toggleDropdown = (index: number) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = index;
  }
};

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
  },
);
watch(
  () => perPage.value,
  () => {
    currentPage.value = 1;
    emit("paginate", { page: 1, perPage: perPage.value });
  },
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

// Handle mobile detection and dropdown outside clicks
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 640;
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (activeDropdown.value !== null && !target.closest(".action-dropdown")) {
      activeDropdown.value = null;
    }
  };
  document.addEventListener("click", handleClickOutside);

  onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
    document.removeEventListener("click", handleClickOutside);
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
