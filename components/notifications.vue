<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="relative flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100 transition-colors"
      title="Notificações"
    >
      <UIcon name="i-heroicons-bell" class="h-5 w-5" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40"
        @click="isOpen = false"
      ></div>
      <div
        v-if="isOpen"
        class="fixed z-50 right-4 top-14 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 class="text-sm font-semibold text-gray-800">Notificações</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllRead"
            class="text-xs text-primary hover:underline font-medium"
          >
            Marcar todas como lidas
          </button>
        </div>

        <!-- List -->
        <div class="max-h-[320px] overflow-y-auto">
          <div v-if="notifications.length === 0" class="py-10 text-center">
            <UIcon name="i-heroicons-bell-slash" class="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p class="text-sm text-gray-400">Sem notificações</p>
          </div>

          <div v-else>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              :class="[
                'px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50',
                !notification.read ? 'bg-blue-50/50' : '',
              ]"
            >
              <div class="flex items-start gap-3">
                <div
                  :class="[
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    getTypeStyles(notification.type),
                  ]"
                >
                  <UIcon :name="getTypeIcon(notification.type)" class="h-4 w-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ notification.title }}
                    </p>
                    <span
                      v-if="!notification.read"
                      class="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"
                    ></span>
                  </div>
                  <p v-if="notification.description" class="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {{ notification.description }}
                  </p>
                  <p class="text-[10px] text-gray-400 mt-1">
                    {{ formatTime(notification.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from "~/stores/notifications";
import { storeToRefs } from "pinia";

const notificationsStore = useNotificationsStore();
const { notifications, unreadCount, hasNewNotifications } =
  storeToRefs(notificationsStore);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    notificationsStore.fetchNotifications();
  }
};

const markAllRead = () => {
  notificationsStore.markAsRead();
};

const handleNotificationClick = (notification: any) => {
  if (!notification.read) {
    notificationsStore.markAsRead(notification.id);
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "order_assigned":
      return "i-heroicons-truck";
    case "order_completed":
      return "i-heroicons-check-circle";
    case "warning":
      return "i-heroicons-exclamation-triangle";
    default:
      return "i-heroicons-information-circle";
  }
};

const getTypeStyles = (type: string) => {
  switch (type) {
    case "order_assigned":
      return "bg-purple-100 text-purple-600";
    case "order_completed":
      return "bg-green-100 text-green-600";
    case "warning":
      return "bg-amber-100 text-amber-600";
    default:
      return "bg-blue-100 text-blue-600";
  }
};

const formatTime = (dateStr: string) => {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return "Ontem";
  return `${diffDays} dias atrás`;
};

const playNotificationSound = () => {
  try {
    const audio = new Audio("/sounds/notify.mp3");
    audio.play();
  } catch (e) {
    // Ignore audio errors
  }
};

watch(hasNewNotifications, (val) => {
  if (val) {
    playNotificationSound();
  }
});

// Poll for new notifications every 30 seconds
let pollInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  notificationsStore.fetchNotifications();
  pollInterval = setInterval(() => {
    notificationsStore.fetchNotifications();
  }, 30000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
