<template>
  <div class="w-full flex flex-col bg-base-200 card p-4 pb-6 gap-1 mt-4">
    <div class="flex items-center justify-between">
      <div class="inline-flex items-center gap-2">
        <nuxt-img :src="user?.image" alt="" class="size-10 rounded-full" />
        <p class="font-bold">{{ user?.name }}</p>
      </div>
      <div class="flex gap-x-3">
        <PencilSquareIcon class="w-5" />
        <TrashIcon class="w-5" />
      </div>
    </div>
    <div class="bg-base-100 h-0.5 w-full" />
    <div class="text-sm">
      <div class="mt-1">{{ text }}</div>
    </div>
    <div class="h-44">
      <nuxt-img :src="image" alt="" class="h-full w-full mt-2" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/solid";
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  image: string;
  worker?: boolean;
}

const { text, image, user } = defineProps({
  text: String,
  image: String,
  user: Object as PropType<User>,
});
</script>
