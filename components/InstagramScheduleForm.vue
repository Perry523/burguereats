<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Quick Schedule Options -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Agendamento Rápido</span>
      </label>
      <div class="grid grid-cols-2 gap-3">
        <button 
          v-for="option in quickOptions" 
          :key="option.label"
          type="button"
          @click="setQuickSchedule(option)"
          class="btn btn-outline btn-sm"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Custom Date and Time -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">
          <span class="label-text font-medium">Data</span>
        </label>
        <input 
          v-model="scheduleData.date"
          type="date"
          class="corporate-input w-full"
          :min="minDate"
        />
      </div>
      <div>
        <label class="label">
          <span class="label-text font-medium">Horário</span>
        </label>
        <select v-model="scheduleData.time" class="corporate-input w-full">
          <option v-for="time in timeOptions" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
      </div>
    </div>

    <!-- Optimal Posting Times -->
    <div class="corporate-elevated-card">
      <h3 class="font-medium text-base-content mb-3">
        <ClockIcon class="w-5 h-5 inline mr-2 text-primary" />
        Melhores Horários para Postar
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 class="font-medium text-base-content/80 mb-2">Dias da Semana</h4>
          <ul class="space-y-1 text-base-content/70">
            <li>• Segunda-feira: 11h - 13h</li>
            <li>• Terça-feira: 11h - 13h, 19h - 21h</li>
            <li>• Quarta-feira: 11h - 13h, 19h - 21h</li>
            <li>• Quinta-feira: 11h - 13h, 19h - 21h</li>
            <li>• Sexta-feira: 10h - 11h, 19h - 21h</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-base-content/80 mb-2">Fins de Semana</h4>
          <ul class="space-y-1 text-base-content/70">
            <li>• Sábado: 10h - 11h, 14h - 15h</li>
            <li>• Domingo: 10h - 11h, 14h - 15h</li>
          </ul>
          <div class="mt-3 p-2 bg-info/10 rounded text-info text-xs">
            💡 Baseado no seu histórico de engajamento
          </div>
        </div>
      </div>
    </div>

    <!-- Recurring Schedule -->
    <div>
      <div class="flex items-center space-x-2 mb-3">
        <input 
          v-model="scheduleData.isRecurring"
          type="checkbox"
          class="checkbox checkbox-primary"
        />
        <label class="label-text font-medium">Agendamento Recorrente</label>
      </div>
      
      <div v-if="scheduleData.isRecurring" class="space-y-4 pl-6">
        <div>
          <label class="label">
            <span class="label-text">Frequência</span>
          </label>
          <select v-model="scheduleData.frequency" class="corporate-input w-full">
            <option value="daily">Diariamente</option>
            <option value="weekly">Semanalmente</option>
            <option value="monthly">Mensalmente</option>
          </select>
        </div>
        
        <div v-if="scheduleData.frequency === 'weekly'">
          <label class="label">
            <span class="label-text">Dias da Semana</span>
          </label>
          <div class="flex flex-wrap gap-2">
            <label 
              v-for="day in weekDays" 
              :key="day.value"
              class="flex items-center space-x-1 cursor-pointer"
            >
              <input 
                v-model="scheduleData.weekDays"
                type="checkbox"
                :value="day.value"
                class="checkbox checkbox-sm checkbox-primary"
              />
              <span class="text-sm">{{ day.label }}</span>
            </label>
          </div>
        </div>
        
        <div>
          <label class="label">
            <span class="label-text">Até quando?</span>
          </label>
          <input 
            v-model="scheduleData.endDate"
            type="date"
            class="corporate-input w-full"
            :min="scheduleData.date"
          />
        </div>
      </div>
    </div>

    <!-- Content Template -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Template de Conteúdo (Opcional)</span>
      </label>
      <select v-model="scheduleData.template" class="corporate-input w-full">
        <option value="">Selecionar template...</option>
        <option value="promotion">Promoção</option>
        <option value="tip">Dica/Tutorial</option>
        <option value="behind_scenes">Bastidores</option>
        <option value="testimonial">Depoimento</option>
        <option value="product_showcase">Vitrine de Produto</option>
      </select>
    </div>

    <!-- Auto-generate Content -->
    <div class="flex items-center space-x-2">
      <input 
        v-model="scheduleData.autoGenerate"
        type="checkbox"
        class="checkbox checkbox-primary"
      />
      <label class="label-text">Gerar conteúdo automaticamente com IA</label>
    </div>

    <!-- Preview -->
    <div v-if="scheduleData.date && scheduleData.time" class="corporate-elevated-card">
      <h3 class="font-medium text-base-content mb-3">Preview do Agendamento</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-base-content/70">Data e Hora:</span>
          <span class="font-medium">{{ formatSchedulePreview() }}</span>
        </div>
        <div v-if="scheduleData.isRecurring" class="flex justify-between">
          <span class="text-base-content/70">Frequência:</span>
          <span class="font-medium">{{ getFrequencyLabel() }}</span>
        </div>
        <div v-if="scheduleData.template" class="flex justify-between">
          <span class="text-base-content/70">Template:</span>
          <span class="font-medium">{{ getTemplateLabel() }}</span>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-base-300">
      <button 
        type="button" 
        @click="$emit('cancel')"
        class="corporate-button-secondary"
      >
        Cancelar
      </button>
      <button 
        type="submit"
        :disabled="!isFormValid"
        class="corporate-button-primary"
      >
        <CalendarDaysIcon class="w-4 h-4" />
        Agendar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/vue/24/solid";

const emit = defineEmits(['schedule', 'cancel']);

// Form data
const scheduleData = ref({
  date: '',
  time: '09:00',
  isRecurring: false,
  frequency: 'weekly',
  weekDays: [],
  endDate: '',
  template: '',
  autoGenerate: false,
});

// Quick schedule options
const quickOptions = ref([
  { label: 'Hoje 18h', hours: 0, time: '18:00' },
  { label: 'Amanhã 9h', hours: 24, time: '09:00' },
  { label: 'Amanhã 18h', hours: 24, time: '18:00' },
  { label: 'Próxima Segunda 9h', days: 'nextMonday', time: '09:00' },
]);

// Time options
const timeOptions = ref([
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]);

// Week days
const weekDays = ref([
  { label: 'Dom', value: 0 },
  { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 },
  { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 },
  { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 },
]);

// Computed properties
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const isFormValid = computed(() => {
  return scheduleData.value.date && scheduleData.value.time;
});

// Methods
const setQuickSchedule = (option: any) => {
  const now = new Date();
  let targetDate = new Date();

  if (option.days === 'nextMonday') {
    const daysUntilMonday = (1 + 7 - now.getDay()) % 7 || 7;
    targetDate.setDate(now.getDate() + daysUntilMonday);
  } else if (option.hours) {
    targetDate.setHours(targetDate.getHours() + option.hours);
  }

  scheduleData.value.date = targetDate.toISOString().split('T')[0];
  scheduleData.value.time = option.time;
};

const formatSchedulePreview = () => {
  if (!scheduleData.value.date || !scheduleData.value.time) return '';
  
  const date = new Date(`${scheduleData.value.date}T${scheduleData.value.time}`);
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const getFrequencyLabel = () => {
  const labels = {
    daily: 'Todos os dias',
    weekly: 'Semanalmente',
    monthly: 'Mensalmente',
  };
  return labels[scheduleData.value.frequency] || '';
};

const getTemplateLabel = () => {
  const labels = {
    promotion: 'Promoção',
    tip: 'Dica/Tutorial',
    behind_scenes: 'Bastidores',
    testimonial: 'Depoimento',
    product_showcase: 'Vitrine de Produto',
  };
  return labels[scheduleData.value.template] || '';
};

const handleSubmit = () => {
  if (!isFormValid.value) return;
  
  const scheduleDateTime = new Date(`${scheduleData.value.date}T${scheduleData.value.time}`);
  
  emit('schedule', {
    ...scheduleData.value,
    scheduledDate: scheduleDateTime,
  });
};

// Initialize with default date (tomorrow)
onMounted(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  scheduleData.value.date = tomorrow.toISOString().split('T')[0];
});
</script>
