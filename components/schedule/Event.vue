<template>
  <div v-if="!isBlocked" class="px-5 py-3 relative z-10">
    <div class="text-lg">
      {{ title }} às
      <b class="text-sm"
        >{{ dayjs(start).format("HH:mm") }} -
        {{ dayjs(end).format("HH:mm") }}</b
      >
    </div>

    <div class="my-1 text-sm">Cliente: {{ client_name }}</div>
    <div class="flex flex-col gap-2 mt-4">
      <div
        @click="
          () => {
            rescheduleModalOpen = true;
            closeModal();
          }
        "
        class="btn w-full"
      >
        Remarcar
      </div>
      <div
        @click="
          () => {
            finisAppointmentOpen = true;
            closeModal();
          }
        "
        class="btn btn-primary w-full"
      >
        Encerrar agendamento
      </div>
    </div>
    <XMarkIcon
      @click="closeModal"
      class="absolute top-2 right-3 w-6 h-6 text-gray-800 cursor-pointer"
    />
  </div>
  <BaseDialog v-model="finisAppointmentOpen" title="Finalizar agendamento">
    <FinishAppointment
      @finish="handleFinish"
      :loading
      :title
      :id="id"
      :client_id
      :client_name
    />
  </BaseDialog>

  <BaseDialog v-model="rescheduleModalOpen" title="Remarcar agendamento">
    <div class="flex flex-col gap-3">
      <input-base
        v-model="newDate"
        label="Nova Data"
        type="date"
        input-classes="w-full"
      />
      <autocomplete
        v-model="newHour"
        label="Novo Horário"
        force-open
        mask="##:##"
        :loading="loadingSlots"
        :options="slots"
        option-label="hour"
        option-value="hour"
        input-classes="w-full"
        :create-register="false"
        :disabled="!newDate"
      />

      <div class="flex gap-2 justify-end mt-4">
        <button @click="rescheduleModalOpen = false" class="btn btn-ghost">
          Cancelar
        </button>
        <button @click="handleReschedule" :disabled="!newDate || !newHour || rescheduleLoading" class="btn btn-primary">
          <span v-if="rescheduleLoading" class="loading loading-spinner loading-sm"></span>
          Remarcar
        </button>
      </div>
    </div>
  </BaseDialog>
</template>
<script setup lang="ts">
// import { PencilSquareIcon } from '@heroicons/vue/24/solid';
import { XMarkIcon } from "@heroicons/vue/24/solid";
import dayjs from "dayjs";
import { useToast } from "vue-toast-notification";
import { api } from "~/server/api";
const client = ref<Client>();
const finisAppointmentOpen = ref(false);
const rescheduleModalOpen = ref(false);
const loading = ref();
const rescheduleLoading = ref(false);
const loadingSlots = ref(false);
const newDate = ref("");
const newHour = ref("");
const slots = ref([]);
interface Client {
  user: User;
}
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  service_id: {
    type: Number,
    required: true,
  },
  client_id: {
    type: Number,
    required: true,
  },
  client_name: {
    type: String,
    default: "",
  },
  order_id: {
    type: Number,
    required: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  is_recurrent: {
    type: Boolean,
    default: false,
  },
});

// Computed property for easier access
const isRecurrent = computed(() => props.is_recurrent);
// onMounted(async () => {
//     const { data } = await api('/client/' + props.client_id)
//     client.value = data
// })
const emit = defineEmits(["finished", "rescheduled"]);
function closeModal() {
  document.querySelector(".navbar")?.click();
}
async function handleFinish(data: { status: string; finishAllAppointments: boolean }) {
  loading.value = true;
  try {
    const response = await api.post("finish-appointment/" + props.id, {
      status: data.status,
      finishAllAppointments: data.finishAllAppointments,
    });

    finisAppointmentOpen.value = false;

    // If finishAllAppointments is true, emit the list of canceled appointment IDs
    if (data.finishAllAppointments && response.data.canceledAppointmentIds) {
      emit("finished", {
        id: props.id,
        canceledAppointmentIds: response.data.canceledAppointmentIds
      });
    } else {
      emit("finished", props.id);
    }

    closeModal();
  } catch (error) {
    console.error('Error finishing appointment:', error);
    useToast().error("Erro ao finalizar agendamento");
  } finally {
    loading.value = false;
  }
}

async function handleReschedule() {
  if (!newDate.value || !newHour.value) return;

  try {
    rescheduleLoading.value = true;

    const { data } = await api.post(`/reschedule-appointment/${props.id}`, {
      date: newDate.value,
      hour: newHour.value,
    });

    rescheduleModalOpen.value = false;

    emit("rescheduled", { oldId: props.id, updatedAppointment: data.appointment });

    // Reset form
    newDate.value = "";
    newHour.value = "";
    slots.value = [];

    // Show success message
    useToast().success("Agendamento remarcado com sucesso!");

  } catch (err) {
    console.error(err);
    useToast().error("Erro ao remarcar agendamento");
  } finally {
    rescheduleLoading.value = false;
  }
}

// Watch for date changes to fetch available slots
watch([newDate], async () => {
  if (newDate.value && props.service_id) {
    // Reset hour when date changes
    newHour.value = "";
    loadingSlots.value = true;
    try {
      const { data } = await api("/slots", {
        params: {
          date: newDate.value,
          serviceId: props.service_id,
        },
      });
      const today = dayjs().valueOf();
      const hours = data.filter((slot: { time: string }) => {
        const [hour, minute] = slot.time.split(":");
        const slotTime = dayjs(newDate.value).hour(parseInt(hour)).minute(parseInt(minute)).valueOf();
        return slotTime > today;
      }).map((slot: { time: string }) => ({ hour: slot.time }));
      slots.value = hours;
    } catch (error) {
      console.error("Error fetching slots:", error);
      slots.value = [];
    } finally {
      loadingSlots.value = false;
    }
  } else {
    // Clear slots if no date or service
    slots.value = [];
    newHour.value = "";
  }
});

// Watch for modal close to reset form
watch(rescheduleModalOpen, (isOpen) => {
  if (!isOpen) {
    // Reset form when modal is closed
    newHour.value = "";
    slots.value = [];
  }
  else {
    newDate.value = dayjs(props.start).format("YYYY-MM-DD");
  }
});
</script>
