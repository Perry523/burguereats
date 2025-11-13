<template>
  <p class="text-2xl font-bold">{{ service?.name }}</p>
  <span class="text-base">{{ handleTime(service?.duration as number) }}</span>
  <div class="w-full flex flex-col bg-base-200 card p-4 gap-1 mt-4">
    <div class="flex items-center justify-between">
      <div class="inline-flex items-center gap-2">
        <nuxt-img loading="lazy" :src="user?.image" alt="" class="size-10 rounded-full" />
        <p class="font-bold">{{ user?.name }}</p>
      </div>
      <span class="text-sm">{{ created_at }}</span>
    </div>
    <div class="bg-base-100 h-0.5 w-full" />
    <div v-if="observations" class="text-sm">
      <span class="font-bold">Observações:</span><br />
      <p class="mt-1">{{ observations }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type User } from "~/models/user";
import { type Service } from "../models/services";

const { user, service, observations, created_at } = defineProps({
  user: Object as PropType<User>,
  service: Object as PropType<Service>,
  profissional_id: String,
  created_at: String,
  observations: String || undefined,
});
</script>
