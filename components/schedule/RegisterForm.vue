<template>
  <form class="flex flex-col gap-3 sm:pb-16" @submit="submit">
    <autocomplete :error="errors['client']" v-model="client" :options="clients" force-open :loading="loadingClients"
      label="Cliente" createRegister option-label="name" option-value="clientId" input-classes="w-full"
      @create="isOpened = true" />
    <autocomplete :error="errors['service']" v-model="service" force-open get-id :loading="loadingServices"
      :options="services" label="Serviço" createRegister option-label="name" option-value="id" input-classes="w-full"
      @create="isServiceOpened = true" />
    <autocomplete
      v-if="availableVariants?.length"
      :error="errors['variant_id']"
      v-model="variant_id"
      force-open
      get-id
      :options="availableVariants"
      label="Variante"
      option-label="name"
      option-value="id"
      input-classes="w-full"
      :create-register="false"
    />
    <input-base :error="errors['date']" v-model="date" label="Dia" type="date" input-classes="w-full" />
    <autocomplete :error="errors['hour']" v-model="hour" label="Horário" text-only force-open mask="##:##"
      :loading="loadingSlots" :options="slots" option-label="hour" option-value="hour" input-classes="w-full"
      :create-register="false" :disabled="!client || !service || !date" />

    <div class="fixed bottom-2 md:bottom-4 left-0 px-4 md:px-10 w-full">
      <base-button :loading="loading" class="w-full mt-4 mb-2 ">Salvar</base-button>
    </div>
  </form>
  <base-dialog title="Cadastrar novo cliente" v-model="isOpened">
    <clients-register-form v-if="isOpened" @submit="handleCreateClient" />
  </base-dialog>
  <base-dialog title="Cadastrar novo serviço" v-model="isServiceOpened">
    <services-register-form
      v-if="isServiceOpened"
      @submit="handleCreateService"
    />
  </base-dialog>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { useForm } from "vee-validate";
import { useToast } from "vue-toast-notification";
import * as yup from "yup";
import { api } from "~/server/api";
const isOpened = ref();
const isServiceOpened = ref();
const props = defineProps({
  appointment: {
    type: Object as () => Schedule,
    required: false,
  },
  services: {
    type: Array as () => Service[],
    required: false,
  },
  clients: {
    type: Array as () => User[],
    required: false,
  },
  startDate: {
    type: String,
    required: false,
  },
  startHour: {
    type: String,
    required: false,
  },
  selectedProfessional: {
    type: Number,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["submit", "update-clients"]);
const validationSchema = yup.object().shape({
  client: yup.string().required("required_custom"),
  service: yup.string().required("required_custom"),
  variant_id: yup.string().when("service", {
    is: () => {
      return availableVariants.value?.length > 0;
    },
    then: () => yup.string().required("A variante é obrigatória"),
    otherwise: () => yup.string().nullable(),
  }),
  date: yup.string().required("A data é obrigatória"),
  hour: yup.string().required("Selecione um horário"),
});
const availableVariants = computed(() => {
  const variants = [];
  selectedService.value?.products.forEach((product) => {
    product.variants.forEach((variant) => {
      variants.push(variant);
    });
  });
  return variants;
});
const initialValue = props.appointment?.service
  ? {
      client: props.appointment?.client,
      service: props.appointment?.service,
      variant: props.appointment?.variant_id,
      date: dayjs(props.appointment?.date).format("YYYY-MM-DD"),
      hour: dayjs(props.appointment?.date).format("HH:mm"),
    }
  : {
      date: props.startDate
        ? dayjs(props.startDate).format("YYYY-MM-DD")
        : undefined,
      hour: props.startHour ? props.startHour : undefined,
    };
const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: initialValue,
});
const [client] = defineField("client");
const [service] = defineField("service");
const [variant_id] = defineField("variant_id");
const [date] = defineField("date");
const [hour] = defineField("hour");
const toast = useToast();

const loadingClients = ref(false);
const loadingServices = ref(false);
const loadingSlots = ref(false);

const selectedService = computed(() => {
  return props.services?.find((s) => s.id === service.value);
});

function handleFormSubmit(values: object) {
  emit("submit", values);
}
const slots = ref([]);
const submit = handleSubmit(handleFormSubmit);
// function handleHour(text: string) {
//   if (text.length === 3 && hour.value?.length === 2) {
//     hour.value = text.slice(0, 2) + ":" + text.slice(2);
//   } else if (text.length === 3 && hour.value?.length === 4) {
//     hour.value = text.replace(":", "");
//   } else hour.value = text;
// }
watch([date, service, client], async () => {
  const params = {
    date: date.value,
    serviceId: service.value,
  };
  if (date.value && service.value && client.value) {
    loadingSlots.value = true;
    try {
      const { data } = await api("/slots", {
        params: {
          ...params,
          professionalId: props.selectedProfessional,
        },
      });
      const today = dayjs().valueOf()
      const hours = data.filter((slot: { time: string }) => {
        const [hour, minute] = slot.time.split(":");
        const slotTime = dayjs(date.value).hour(parseInt(hour)).minute(parseInt(minute)).valueOf();
        return slotTime > today;
      }).map((slot: { time: string }) => slot.time);
      slots.value = hours;
    } finally {
      loadingSlots.value = false;
    }
  }
});
async function handleCreateClient(values: User) {
  try {
    const { data } = await api.post("/clients", values);
    client.value = data.user_id;
    toast.success("Cliente cadastrado com sucesso!");
    isOpened.value = false;
    emit("update-clients");
  } catch (err) {
    console.error(err);
    toast.error("Error request!");
  }
}

async function handleCreateService(values: Service) {
  try {
    const { data } = await api.post("/services", values);
    service.value = data.id;
    toast.success("Serviço cadastrado com sucesso!");
    isServiceOpened.value = false;
  } catch (err) {
    console.error(err);
    toast.error("Error request!");
  }
}
watch(availableVariants, () => {
  variant_id.value = null;
  if (availableVariants.value?.length === 1) {
    variant_id.value = availableVariants.value[0].id;
  }
});
</script>
