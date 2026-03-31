<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <NuxtLink to="/admin/companies" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <UIcon name="i-heroicons-arrow-left" class="h-6 w-6 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Editar Empresa</h1>
        <p class="text-sm text-gray-500">Gerencie as informações detalhadas desta empresa</p>
      </div>
    </div>

    <!-- Logo -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Logo da Empresa</h2>
      <div class="flex items-center gap-6">
        <div class="relative group">
          <div
            class="h-24 w-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50"
          >
            <img
              v-if="logoUrl"
              :src="logoUrl"
              alt="Logo"
              class="h-full w-full object-cover rounded-2xl"
            />
            <UIcon v-else name="i-heroicons-building-storefront" class="h-10 w-10 text-gray-300" />
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            @click="triggerLogoUpload"
          >
            <UIcon name="i-heroicons-camera" class="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <button
            type="button"
            @click="triggerLogoUpload"
            :disabled="isUploadingLogo"
            class="px-4 py-2 text-sm font-medium text-primary bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-50 transition-colors"
          >
            {{ isUploadingLogo ? 'Enviando...' : 'Alterar logo' }}
          </button>
          <p class="text-xs text-gray-400 mt-1">JPG, PNG ou SVG. Máx. 2MB.</p>
        </div>
        <input
          ref="logoInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleLogoUpload"
        />
      </div>
    </div>

    <!-- Company Info Form -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Informações da Empresa</h2>
      <form @submit.prevent="saveCompany" class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Nome da empresa"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Negócio</label>
          <select
            v-model="form.type"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="restaurant">Restaurante</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="email@empresa.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input
            v-model="form.address"
            type="text"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Rua, número, bairro"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              v-model="form.city"
              type="text"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Cidade"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input
              v-model="form.state"
              type="text"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="UF"
              maxlength="2"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {{ isSaving ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </form>
    </div>

    <!-- Operating Hours -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Horários de Funcionamento</h2>
      <p class="text-sm text-gray-500 mb-4">Defina os horários de abertura e fechamento para cada dia da semana.</p>
      <form @submit.prevent="saveOperatingHours" class="space-y-3 max-w-lg">
        <div v-for="(day, idx) in dayLabels" :key="idx" class="grid grid-cols-[120px_1fr_1fr_auto] items-center gap-3">
          <span class="text-sm font-medium text-gray-700">{{ day }}</span>
          <div>
            <input
              v-model="operatingHours[idx].open_time"
              type="time"
              :disabled="!operatingHours[idx].enabled"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-40 disabled:bg-gray-100"
            />
          </div>
          <div>
            <input
              v-model="operatingHours[idx].close_time"
              type="time"
              :disabled="!operatingHours[idx].enabled"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-40 disabled:bg-gray-100"
            />
          </div>
          <label class="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              v-model="operatingHours[idx].enabled"
              class="checkbox checkbox-sm checkbox-primary"
            />
            <span class="text-xs text-gray-500">Aberto</span>
          </label>
        </div>

        <button
          type="submit"
          :disabled="isSavingHours"
          class="mt-4 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {{ isSavingHours ? 'Salvando...' : 'Salvar Horários' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const auth = useAuthStore();
const route = useRoute();
const toast = useToast();

const isSaving = ref(false);
const isSavingHours = ref(false);
const isUploadingLogo = ref(false);
const logoUrl = ref("");
const logoInput = ref<HTMLInputElement | null>(null);

const dayLabels = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

interface DayHours {
  open_time: string;
  close_time: string;
  enabled: boolean;
}

const operatingHours = ref<DayHours[]>(
  Array.from({ length: 7 }, () => ({ open_time: '08:00', close_time: '22:00', enabled: true }))
);

const form = reactive({
  name: "",
  type: "restaurant",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
});

const companyId = computed(() => route.params.id as string);

const loadCompany = async () => {
  if (!companyId.value) return;

  try {
    const res = await $fetch<{ success: boolean; data: any }>(
      `/api/companies/${companyId.value}`
    );
    if (res.success && res.data) {
      const c = res.data;
      form.name = c.name || "";
      form.type = c.type || "restaurant";
      form.email = c.email || "";
      form.phone = c.phone || "";
      form.address = c.address || "";
      form.city = c.city || "";
      form.state = c.state || "";
      form.zipCode = c.zip_code || c.zipCode || "";
      logoUrl.value = c.logo || "";

      // Load operating hours
      if (c.operating_hours && typeof c.operating_hours === 'object') {
        for (let i = 0; i < 7; i++) {
          if (c.operating_hours[i]) {
            operatingHours.value[i] = {
              open_time: c.operating_hours[i].open_time || '08:00',
              close_time: c.operating_hours[i].close_time || '22:00',
              enabled: c.operating_hours[i].enabled !== false,
            };
          } else {
            operatingHours.value[i] = { open_time: '', close_time: '', enabled: false };
          }
        }
      }
    }
  } catch (error) {
    console.error("Error loading company:", error);
  }
};

const saveCompany = async () => {
  if (!companyId.value) return;

  isSaving.value = true;
  try {
    await $fetch(`/api/companies/${companyId.value}`, {
      method: "PUT",
      body: {
        name: form.name,
        type: form.type,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      },
    });

    toast.add({ color: "success", title: "Empresa atualizada com sucesso" });
  } catch (error: any) {
    console.error("Error saving company:", error);
    toast.add({
      color: "error",
      title: "Erro ao atualizar empresa",
      description: error?.data?.statusMessage || "Tente novamente",
    });
  } finally {
    isSaving.value = false;
  }
};

const saveOperatingHours = async () => {
  if (!companyId.value) return;

  isSavingHours.value = true;
  try {
    // Build the operating_hours object: key is day index (0-6)
    const hoursPayload: Record<number, any> = {};
    for (let i = 0; i < 7; i++) {
      const h = operatingHours.value[i];
      if (h.enabled && h.open_time && h.close_time) {
        hoursPayload[i] = {
          open_time: h.open_time,
          close_time: h.close_time,
          enabled: true,
        };
      } else {
        hoursPayload[i] = { open_time: '', close_time: '', enabled: false };
      }
    }

    await $fetch(`/api/companies/${companyId.value}`, {
      method: "PUT",
      body: { operating_hours: hoursPayload },
    });

    toast.add({ color: "success", title: "Horários salvos com sucesso" });
  } catch (error: any) {
    console.error("Error saving operating hours:", error);
    toast.add({
      color: "error",
      title: "Erro ao salvar horários",
      description: error?.data?.statusMessage || "Tente novamente",
    });
  } finally {
    isSavingHours.value = false;
  }
};

const triggerLogoUpload = () => {
  logoInput.value?.click();
};

const handleLogoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !companyId.value) return;

  if (file.size > 2 * 1024 * 1024) {
    toast.add({ color: "warning", title: "Imagem deve ter no máximo 2MB" });
    return;
  }

  isUploadingLogo.value = true;
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("companyId", companyId.value);

    const res = await $fetch<{ success: boolean; data: { url: string } }>(
      "/api/uploads/company-logo",
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.success && res.data?.url) {
      logoUrl.value = res.data.url;
      toast.add({ color: "success", title: "Logo atualizada com sucesso" });
    }
  } catch (error: any) {
    console.error("Error uploading logo:", error);
    toast.add({
      color: "error",
      title: "Erro ao enviar logo",
      description: error?.data?.statusMessage || "Tente novamente",
    });
  } finally {
    isUploadingLogo.value = false;
    if (input) input.value = "";
  }
};

onMounted(async () => {
  if (!auth.user) {
    await auth.getCurrentUser();
  }
  
  if (auth.user?.role !== "admin") {
    navigateTo("/admin");
    return;
  }

  await loadCompany();
});
</script>

