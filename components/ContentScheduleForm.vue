<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Post Type -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Tipo de Conteúdo</span>
      </label>
      <div class="grid grid-cols-3 gap-3">
        <label
          v-for="type in postTypes"
          :key="type.value"
          class="cursor-pointer"
        >
          <input
            v-model="formData.type"
            type="radio"
            :value="type.value"
            class="radio radio-primary radio-sm mr-2"
          />
          <span class="text-sm">{{ type.label }}</span>
        </label>
      </div>
    </div>

    <!-- Platform -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Plataforma</span>
      </label>
      <select v-model="formData.platform" class="corporate-input w-full">
        <option value="Instagram">Instagram</option>
        <option value="Facebook" disabled>Facebook (em breve)</option>
        <option value="LinkedIn" disabled>LinkedIn (em breve)</option>
      </select>
    </div>

    <!-- Title -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Título</span>
      </label>
      <input
        v-model="formData.title"
        type="text"
        placeholder="Título do post"
        class="corporate-input w-full"
        required
      />
    </div>

    <!-- Content -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Conteúdo</span>
        <span class="label-text-alt">{{ contentLength }}/2200</span>
      </label>
      <textarea
        v-model="formData.content"
        placeholder="Escreva o conteúdo do seu post..."
        class="corporate-input w-full h-32 resize-none"
        maxlength="2200"
        required
      ></textarea>
    </div>

    <!-- Scheduling -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">
          <span class="label-text font-medium">Data</span>
        </label>
        <input
          v-model="formData.scheduledDate"
          type="date"
          class="corporate-input w-full"
          :min="minDate"
          required
        />
      </div>
      <div>
        <label class="label">
          <span class="label-text font-medium">Horário</span>
        </label>
        <input
          v-model="formData.scheduledTime"
          type="time"
          class="corporate-input w-full"
          required
        />
      </div>
    </div>

    <!-- Status -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Status</span>
      </label>
      <select v-model="formData.status" class="corporate-input w-full">
        <option value="draft">Rascunho</option>
        <option value="scheduled">Agendado</option>
        <option value="published" disabled>Publicado</option>
      </select>
    </div>

    <!-- AI Content Generation -->
    <div class="corporate-elevated-card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-medium text-base-content">Geração de Conteúdo IA</h3>
        <SparklesIcon class="w-5 h-5 text-primary" />
      </div>

      <div class="space-y-3">
        <div>
          <label class="label">
            <span class="label-text font-medium">Tema/Descrição</span>
          </label>
          <input
            v-model="aiPrompt"
            type="text"
            placeholder="Ex: promoção de verão, novo produto, dica de marketing"
            class="corporate-input w-full"
          />
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            @click="generateContent"
            :disabled="!aiPrompt || isGenerating"
            class="corporate-button-primary flex-1"
          >
            <SparklesIcon class="w-4 h-4" />
            {{ isGenerating ? "Gerando..." : "Gerar Conteúdo" }}
          </button>
          <button
            type="button"
            @click="generateHashtags"
            :disabled="!aiPrompt || isGenerating"
            class="corporate-button-secondary"
          >
            # Tags
          </button>
        </div>
      </div>
    </div>

    <!-- Hashtags -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Hashtags Sugeridas</span>
      </label>
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          v-for="hashtag in suggestedHashtags"
          :key="hashtag"
          type="button"
          @click="addHashtag(hashtag)"
          class="btn btn-xs btn-outline"
        >
          {{ hashtag }}
        </button>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="formData.content" class="corporate-elevated-card">
      <h3 class="font-medium text-base-content mb-3">Preview</h3>
      <div class="p-4 bg-base-300/50 rounded-lg">
        <div class="flex items-center space-x-3 mb-3">
          <div
            class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center"
          >
            <CameraIcon class="w-4 h-4 text-white" />
          </div>
          <div>
            <p class="font-medium text-base-content">
              {{ businessSettings.businessName || "Seu Negócio" }}
            </p>
            <p class="text-xs text-base-content/70">
              {{ formatScheduleDate() }}
            </p>
          </div>
        </div>
        <div class="bg-base-200 rounded-lg p-4">
          <h4 class="font-medium text-base-content mb-2">
            {{ formData.title }}
          </h4>
          <p class="text-sm text-base-content whitespace-pre-wrap">
            {{ formData.content }}
          </p>
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
        {{ formData.status === "scheduled" ? "Agendar" : "Salvar" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { CameraIcon, SparklesIcon } from "@heroicons/vue/24/solid";
import { useBusinessSettingsStore } from "~/stores/businessSettings";

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
  selectedDate: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["save", "cancel"]);

const businessSettings = useBusinessSettingsStore();

// Form data
const formData = ref({
  title: "",
  content: "",
  type: "post",
  platform: "Instagram",
  scheduledDate: "",
  scheduledTime: "09:00",
  status: "scheduled",
});

// AI generation
const aiPrompt = ref("");
const isGenerating = ref(false);

// Post types
const postTypes = ref([
  { value: "post", label: "Post" },
  { value: "story", label: "Story" },
  { value: "reel", label: "Reel" },
]);

// Suggested hashtags
const suggestedHashtags = ref([
  "#negocio",
  "#empreendedorismo",
  "#marketing",
  "#vendas",
  "#sucesso",
  "#motivacao",
  "#dicas",
  "#qualidade",
]);

// Computed properties
const contentLength = computed(() => formData.value.content.length);

const minDate = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const isFormValid = computed(() => {
  return (
    formData.value.title.trim() &&
    formData.value.content.trim() &&
    formData.value.scheduledDate &&
    formData.value.scheduledTime
  );
});

// Methods
const addHashtag = (hashtag: string) => {
  if (!formData.value.content.includes(hashtag)) {
    formData.value.content += ` ${hashtag}`;
  }
};

const generateContent = async () => {
  if (!aiPrompt.value) return;

  isGenerating.value = true;
  try {
    const { geminiAI } = await import("~/services/geminiAI");

    if (geminiAI.isAvailable()) {
      const caption = await geminiAI.generateCaption(
        aiPrompt.value,
        "friendly",
        businessSettings.businessType
      );
      formData.value.content = caption;
      formData.value.title = aiPrompt.value;
    } else {
      // Fallback content
      formData.value.content = `🌟 ${aiPrompt.value}

Não perca essa oportunidade incrível! 

✨ Qualidade garantida
🚀 Resultados excepcionais
💯 Satisfação total

#${aiPrompt.value.replace(/\s+/g, "").toLowerCase()} #negocio #sucesso`;
      formData.value.title = aiPrompt.value;
    }
  } catch (error) {
    console.error("Error generating content:", error);
  } finally {
    isGenerating.value = false;
  }
};

const generateHashtags = async () => {
  if (!aiPrompt.value) return;

  isGenerating.value = true;
  try {
    const { geminiAI } = await import("~/services/geminiAI");

    if (geminiAI.isAvailable()) {
      const hashtags = await geminiAI.generateHashtags(
        aiPrompt.value,
        businessSettings.businessType
      );
      suggestedHashtags.value = [
        ...new Set([...suggestedHashtags.value, ...hashtags]),
      ];
    } else {
      // Fallback hashtags
      const generatedHashtags = [
        `#${aiPrompt.value.replace(/\s+/g, "").toLowerCase()}`,
        "#marketing",
        "#vendas",
        "#negocio",
        "#empreendedorismo",
      ];

      suggestedHashtags.value = [
        ...new Set([...suggestedHashtags.value, ...generatedHashtags]),
      ];
    }
  } catch (error) {
    console.error("Error generating hashtags:", error);
  } finally {
    isGenerating.value = false;
  }
};

const formatScheduleDate = () => {
  if (!formData.value.scheduledDate || !formData.value.scheduledTime) return "";

  const date = new Date(
    `${formData.value.scheduledDate}T${formData.value.scheduledTime}`
  );
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const handleSubmit = () => {
  if (!isFormValid.value) return;

  const postData = {
    ...formData.value,
    scheduledDate: formData.value.scheduledDate,
    scheduledTime: formData.value.scheduledTime,
  };

  emit("save", postData);
};

// Initialize form with existing post data or selected date
onMounted(() => {
  if (props.post) {
    formData.value = {
      title: props.post.title || "",
      content: props.post.content || "",
      type: props.post.type || "post",
      platform: props.post.platform || "Instagram",
      scheduledDate: props.post.scheduledDate || "",
      scheduledTime: props.post.scheduledTime || "09:00",
      status: props.post.status || "scheduled",
    };
  } else if (props.selectedDate) {
    formData.value.scheduledDate = props.selectedDate;
  }
});
</script>
