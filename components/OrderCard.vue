<template>
  <div
    class="elevated-card rounded-lg px-3 py-1 shadow-xl overflow-auto transition-shadow"
  >
    <div
      class="flex items-center justify-between font-semibold text-lg border-b border-gray-400 mb-2 pb-1"
    >
      <div>Pedido {{ Math.trunc(Math.random() * 100) }}</div>
      <div class="text-sm">
        {{ dayjs(order.created_at).format("DD/MM/YYYY") }}
      </div>
    </div>
    <div class="font-bold">Serviços</div>
    <div class="mb-3 mt-2">
      <div v-for="(item, i) in order.items" :key="i" class="pb-1">
        <div class="flex">
          <div>{{ item.service.name }} -</div>
          <div class="ml-1">
            {{ toBrl(Number(item.service.price)) }}
          </div>
        </div>
        <div class="flex leading-tight">
          Cliente:
          <b class="ml-1">
            {{ item.user.name }}
          </b>
        </div>
      </div>
    </div>
    <div class="flex justify-between mt-auto">
      <div class="text-lg font-semibold">
        Total: {{ getOrderTotal(order.items) }}
      </div>
      <div v-if="activeTab === 'active'" class="float-right space-x-4 flex">
        <ChatBubbleLeftEllipsisIcon
          class="w-5 sm:w-10 hover:btn-ghost sm:p-2 transition-colors rounded"
          @click="toOrder(order as ItemOrder)"
        />
        <!-- <ArrowsPointingOutIcon
          class="w-5 sm:w-10 hover:btn-ghost sm:p-2 transition-colors rounded"
        /> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { newOrder } from "../models/newOrder";
import type { Schedule } from "../models/schedule";
// import { ChatBubbleLeftEllipsisIcon } from "@heroicons/vue/24/outline";
defineProps({
  order: {
    type: Object as PropType<newOrder>,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
    default: "active",
  },
});
const getOrderTotal = (items: Schedule[]) => {
  const total = items?.reduce(
    (acc, item) => acc + parseFloat(String(item.service.price)),
    0
  );
  return toBrl(total);
};

// function toOrder(order: ItemOrder) {
//   router.push({
//     path: "/chat",
//     query: {
//       redirect: "true",
//     },
//   });
//   // eslint-disable-next-line
//   chatStore.selectedChat = order as any;
// }
</script>
