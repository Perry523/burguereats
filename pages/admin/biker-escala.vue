<template>
  <div class="space-y-6 pt-2">

    <div v-if="isLoading" class="py-12 text-center text-gray-500">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-2" />
      <p>Carregando escala...</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="day in days"
        :key="day.date"
        class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
      >
        <!-- Day Header -->
        <div class="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold',
                day.isToday ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ day.dayNum }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">
                {{ day.label }}
                <span v-if="day.isToday" class="ml-1.5 text-xs font-medium text-primary">(Hoje)</span>
              </p>
              <p class="text-xs text-gray-500">{{ day.fullDate }}</p>
            </div>
          </div>
          <span
            :class="[
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              day.assignments.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
            ]"
          >
            {{ day.assignments.length }} {{ day.assignments.length === 1 ? 'escala' : 'escalas' }}
          </span>
        </div>

        <!-- Assignments -->
        <div v-if="day.assignments.length === 0" class="px-6 py-4 text-center text-gray-400 text-sm">
          Sem escala para este dia.
        </div>
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="a in day.assignments"
            :key="a.id"
            class="flex items-center justify-between px-6 py-3"
          >
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UIcon name="i-ph-storefront-duotone" class="w-4 h-4 text-primary" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ a.company_name }}</p>
                <p v-if="a.hours" class="text-xs text-gray-500">{{ a.hours }}</p>
              </div>
            </div>
            <span
              :class="[
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                a.status === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]"
            >
              {{ a.status === 'confirmado' ? 'Confirmado' : 'Cancelado' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();

const isLoading = ref(false);
const allAssignments = ref<any[]>([]);

const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const toDateStr = (d: Date) => {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

const formatFullDate = (d: Date) => {
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
};

const todayDate = new Date();
const todayStr = toDateStr(todayDate);

// Build 7-day range (today + 6 days)
const dateRange = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(todayDate);
  d.setDate(d.getDate() + i);
  return d;
});

const dateFrom = toDateStr(dateRange[0]);
const dateTo = toDateStr(dateRange[6]);

const days = computed(() => {
  return dateRange.map(d => {
    const dateStr = toDateStr(d);
    return {
      date: dateStr,
      dayNum: d.getDate(),
      label: dayNames[d.getDay()],
      fullDate: formatFullDate(d),
      isToday: dateStr === todayStr,
      assignments: allAssignments.value.filter(a => a.date === dateStr),
    };
  });
});

const fetchEscala = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<{ success: boolean; data?: any[] }>(
      `/api/biker-assignments/my-escala?dateFrom=${dateFrom}&dateTo=${dateTo}`
    );
    allAssignments.value = res?.data || [];
  } catch (error) {
    console.error('Error fetching escala:', error);
    allAssignments.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (!auth.user) await auth.getCurrentUser();
  await fetchEscala();
});
</script>
