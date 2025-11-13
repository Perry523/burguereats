<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Image Upload -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Imagem do Post</span>
      </label>
      <div class="space-y-4">
        <!-- Image Preview -->
        <div v-if="imagePreview" class="relative">
          <img 
            :src="imagePreview" 
            alt="Preview" 
            class="w-full max-w-md h-64 object-cover rounded-lg mx-auto"
          />
          <button 
            type="button"
            @click="removeImage"
            class="absolute top-2 right-2 btn btn-sm btn-error btn-circle"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Upload Area -->
        <div 
          v-else
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          @click="$refs.fileInput.click()"
        >
          <CameraIcon class="w-12 h-12 text-base-content/50 mx-auto mb-4" />
          <p class="text-base-content/70 mb-2">Arraste uma imagem aqui ou clique para selecionar</p>
          <p class="text-sm text-base-content/50">PNG, JPG até 10MB</p>
        </div>

        <input 
          ref="fileInput"
          type="file" 
          accept="image/*" 
          @change="handleFileSelect"
          class="hidden"
        />
      </div>
    </div>

    <!-- Caption -->
    <div>
      <label class="label">
        <span class="label-text font-medium">Legenda</span>
        <span class="label-text-alt">{{ captionLength }}/2200</span>
      </label>
      <textarea 
        v-model="formData.caption"
        placeholder="Escreva uma legenda envolvente para seu post..."
        class="corporate-input w-full h-32 resize-none"
        maxlength="2200"
      ></textarea>
      
      <!-- Hashtag Suggestions -->
      <div class="mt-2">
        <p class="text-sm text-base-content/70 mb-2">Hashtags sugeridas:</p>
        <div class="flex flex-wrap gap-2">
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
    </div>

    <!-- Post Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Status -->
      <div>
        <label class="label">
          <span class="label-text font-medium">Status</span>
        </label>
        <select v-model="formData.status" class="corporate-input w-full">
          <option value="draft">Rascunho</option>
          <option value="scheduled">Agendar</option>
          <option value="published">Publicar Agora</option>
        </select>
      </div>

      <!-- Schedule Date (if scheduled) -->
      <div v-if="formData.status === 'scheduled'">
        <label class="label">
          <span class="label-text font-medium">Data e Hora</span>
        </label>
        <input 
          v-model="formData.scheduledDate"
          type="datetime-local"
          class="corporate-input w-full"
          :min="minDateTime"
        />
      </div>
    </div>

    <!-- Advanced Options -->
    <div class="collapse collapse-arrow bg-base-300/50">
      <input type="checkbox" />
      <div class="collapse-title text-sm font-medium">
        Opções Avançadas
      </div>
      <div class="collapse-content space-y-4">
        <!-- Alt Text -->
        <div>
          <label class="label">
            <span class="label-text font-medium">Texto Alternativo</span>
          </label>
          <input 
            v-model="formData.altText"
            type="text"
            placeholder="Descreva a imagem para acessibilidade"
            class="corporate-input w-full"
            maxlength="100"
          />
        </div>

        <!-- Location -->
        <div>
          <label class="label">
            <span class="label-text font-medium">Localização</span>
          </label>
          <input 
            v-model="formData.location"
            type="text"
            placeholder="Adicionar localização"
            class="corporate-input w-full"
          />
        </div>

        <!-- Comments -->
        <div class="flex items-center space-x-2">
          <input 
            v-model="formData.allowComments"
            type="checkbox"
            class="checkbox checkbox-primary"
          />
          <label class="label-text">Permitir comentários</label>
        </div>
      </div>
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
            <span class="label-text font-medium">Tema/Produto</span>
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
            @click="generateCaption"
            :disabled="!aiPrompt || isGenerating"
            class="corporate-button-primary flex-1"
          >
            <SparklesIcon class="w-4 h-4" />
            {{ isGenerating ? 'Gerando...' : 'Gerar Legenda' }}
          </button>
          <button 
            type="button"
            @click="generateHashtags"
            :disabled="!aiPrompt || isGenerating"
            class="corporate-button-secondary"
          >
            # Hashtags
          </button>
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
        {{ formData.status === 'published' ? 'Publicar' : 'Salvar' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  CameraIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
  post: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['save', 'cancel']);

// Form data
const formData = ref({
  caption: '',
  image: null,
  status: 'draft',
  scheduledDate: '',
  altText: '',
  location: '',
  allowComments: true,
});

// AI generation
const aiPrompt = ref('');
const isGenerating = ref(false);

// Image handling
const imagePreview = ref('');
const fileInput = ref(null);

// Suggested hashtags
const suggestedHashtags = ref([
  '#negocio', '#empreendedorismo', '#marketing', '#vendas',
  '#sucesso', '#motivacao', '#dicas', '#qualidade'
]);

// Computed properties
const captionLength = computed(() => formData.value.caption.length);

const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10); // Minimum 10 minutes from now
  return now.toISOString().slice(0, 16);
});

const isFormValid = computed(() => {
  return formData.value.caption.trim() && 
         (imagePreview.value || formData.value.image) &&
         (formData.value.status !== 'scheduled' || formData.value.scheduledDate);
});

// Methods
const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  }
};

const processFile = (file: File) => {
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    alert('Arquivo muito grande. Máximo 10MB.');
    return;
  }

  formData.value.image = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  formData.value.image = null;
  imagePreview.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const addHashtag = (hashtag: string) => {
  if (!formData.value.caption.includes(hashtag)) {
    formData.value.caption += ` ${hashtag}`;
  }
};

const generateCaption = async () => {
  if (!aiPrompt.value) return;

  isGenerating.value = true;
  try {
    const { geminiAI } = await import('~/services/geminiAI');

    if (geminiAI.isAvailable()) {
      const caption = await geminiAI.generateCaption(
        aiPrompt.value,
        'friendly',
        'negócio'
      );
      formData.value.caption = caption;
    } else {
      // Fallback content
      const generatedCaption = `🌟 ${aiPrompt.value} - Uma oportunidade incrível para você!

Não perca essa chance única de transformar seu negócio.

💡 Dicas exclusivas
🚀 Resultados garantidos
✨ Qualidade premium

#${aiPrompt.value.replace(/\s+/g, '').toLowerCase()} #negocio #sucesso #qualidade`;

      formData.value.caption = generatedCaption;
    }
  } catch (error) {
    console.error('Error generating caption:', error);

    // Fallback content on error
    const generatedCaption = `🌟 ${aiPrompt.value} - Uma oportunidade incrível para você!

Não perca essa chance única de transformar seu negócio.

💡 Dicas exclusivas
🚀 Resultados garantidos
✨ Qualidade premium

#${aiPrompt.value.replace(/\s+/g, '').toLowerCase()} #negocio #sucesso #qualidade`;

    formData.value.caption = generatedCaption;
  } finally {
    isGenerating.value = false;
  }
};

const generateHashtags = async () => {
  if (!aiPrompt.value) return;

  isGenerating.value = true;
  try {
    const { geminiAI } = await import('~/services/geminiAI');

    if (geminiAI.isAvailable()) {
      const hashtags = await geminiAI.generateHashtags(aiPrompt.value, 'negócio');
      suggestedHashtags.value = [...new Set([...suggestedHashtags.value, ...hashtags])];
    } else {
      // Fallback hashtags
      const generatedHashtags = [
        `#${aiPrompt.value.replace(/\s+/g, '').toLowerCase()}`,
        '#marketing', '#vendas', '#negocio', '#empreendedorismo'
      ];

      suggestedHashtags.value = [...new Set([...suggestedHashtags.value, ...generatedHashtags])];
    }
  } catch (error) {
    console.error('Error generating hashtags:', error);

    // Fallback hashtags on error
    const generatedHashtags = [
      `#${aiPrompt.value.replace(/\s+/g, '').toLowerCase()}`,
      '#marketing', '#vendas', '#negocio', '#empreendedorismo'
    ];

    suggestedHashtags.value = [...new Set([...suggestedHashtags.value, ...generatedHashtags])];
  } finally {
    isGenerating.value = false;
  }
};

const handleSubmit = () => {
  if (!isFormValid.value) return;
  
  const postData = {
    ...formData.value,
    scheduledDate: formData.value.status === 'scheduled' ? new Date(formData.value.scheduledDate) : null,
  };
  
  emit('save', postData);
};

// Initialize form with existing post data
onMounted(() => {
  if (props.post) {
    formData.value = {
      caption: props.post.caption || '',
      image: null,
      status: props.post.status || 'draft',
      scheduledDate: props.post.scheduledDate ? 
        new Date(props.post.scheduledDate).toISOString().slice(0, 16) : '',
      altText: props.post.altText || '',
      location: props.post.location || '',
      allowComments: props.post.allowComments !== false,
    };
    
    if (props.post.image) {
      imagePreview.value = props.post.image;
    }
  }
});
</script>
