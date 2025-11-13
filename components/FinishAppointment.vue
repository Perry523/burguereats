<template>
  <div>
    <!-- <div class="text-lg">{{ title }} às <b class="text-sm">{{ dayjs(start).format('HH:mm') }} - {{
            dayjs(end).format('HH:mm') }}</b>
        </div> -->
    <div class="text-lg mt-3">Serviço: {{ title }}</div>
    <div class="my-1 text-sm">Cliente: {{ client_name }}</div>
    <div class="my-5">
      <input-base
        v-model="status"
        label="Status"
        :options="[
          {
            label: 'Finalizado',
            value: 'finished',
          },
          {
            label: 'Cancelado',
            value: 'canceled',
          },
        ]"
      />
      <div v-if="error" class="text-sm text-red-600">
        Selecione o status do atendimento
      </div>

      <!-- Show checkbox for canceling all future appointments when status is canceled -->
      <div v-if="status === 'canceled'" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            v-model="finishAllAppointments"
            class="checkbox checkbox-warning mt-1"
          />
          <div>
            <div class="font-medium text-yellow-800">Cancelar todos os agendamentos futuros</div>
            <div class="text-sm text-yellow-700 mt-1">
              Ao marcar esta opção, todos os agendamentos futuros desta série recorrente serão cancelados
              e as informações de agendamento recorrente do paciente serão removidas.
            </div>
          </div>
        </label>
      </div>
    </div>
    <base-button @click="handleConfirm" :loading class="w-full mt-2"
      >Confirmar</base-button
    >
  </div>
</template>
<script setup lang="ts">
const error = ref(false);
const status = ref();
const finishAllAppointments = ref(false);
const emit = defineEmits(["finish"]);
defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  client_id: {
    type: Number,
    required: true,
  },
  client_name: {
    type: String,
    required: true,
  },
});
function handleConfirm() {
  if (!status.value) {
    error.value = true;
    return;
  }
  emit("finish", {
    status: status.value,
    finishAllAppointments: finishAllAppointments.value
  });
}
watch(status, () => {
  error.value = false;
  // Reset checkbox when status changes
  if (status.value !== 'canceled') {
    finishAllAppointments.value = false;
  }
});
</script>
