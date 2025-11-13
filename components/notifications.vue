<template>
  <div class="relative">
    <BellIcon class="w-6 cursor-pointer" @click="toggleNotifications" />
    <div
      v-if="newNotifications.length"
      class="absolute -top-2 -right-2 pt-[1px] text-xs text-white font-black w-4 h-4 bg-red-500 rounded-full"
    >
      {{ newNotifications.length }}
    </div>
    <teleport to="body">
      <div v-if="isOpen" class="fixed z-50 top-12 right-4 w-72">
        <div class="relative">
          <div
            class="fixed top-10 lg:right-[128px] right-[52px] z-40 border border-base-300 w-4 h-4 bg-base-100 transform rotate-45"
          ></div>

          <div
            class="relative bg-base-100 z-50 rounded-lg shadow-xl border border-base-300"
          >
            <div
              class="px-4 py-3 flex gap-2 font-semibold border-b border-base-300"
            >
              <h3 class="">Notificações</h3>
              <span v-if="notifications.length"
                >({{ notifications.length }})</span
              >
            </div>
            <div class="max-h-[300px] overflow-y-auto">
              <div v-if="notifications.length === 0" class="p-4">
                <p class="text-center py-2 text-sm text-base-content/70">
                  Sem notificações
                </p>
              </div>

              <div v-else>
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="py-2 px-4 border-b border-base-300 hover:bg-base-200 transition-colors cursor-pointer"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <p class="text-sm font-medium">
                          {{ notification.title }}
                        </p>
                        <p
                          v-if="!notification.read"
                          class="text-xs text-base-content/50 mt-1"
                        >
                          {{ formatNotificationTime(notification.created_at) }}
                        </p>
                        <!-- <button
                          v-if="!notification.read"
                          @click.stop="markAsRead(notification.id)"
                          class="text-xs text-primary hover:text-primary-focus"
                        >
                          Marcar como lido
                        </button> -->
                      </div>
                      <p class="text-xs text-base-content/70">
                        {{ notification.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { BellIcon } from "@heroicons/vue/24/solid";
import { useNotifications } from "~/stores/notifications";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";

const isOpen = ref(false);
const notificationsStore = useNotifications();
const { notifications, newNotifications, hasNewNotifications } =
  storeToRefs(notificationsStore);

const toggleNotifications = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = () => {
  //   isOpen.value = false;
};

const formatNotificationTime = (createdAt) => {
  const now = new Date();
  const notificationDate = new Date(createdAt);
  const diffDays = Math.floor((now - notificationDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return notificationDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "Ontem";
  } else {
    return `${diffDays} dias atrás`;
  }
};

const playNotificationSound = () => {
  const audio = new Audio("/sounds/notify.mp3");
  audio.play();
};

watch(hasNewNotifications, () => {
  if (hasNewNotifications.value) {
    playNotificationSound();
  }
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  navigator.serviceWorker.onmessage = function (evt) {
    const message = evt.data;
    console.log(message);
    if (message.type === "notification") {
      const data = message.data;
      const newNotification = {
        title: data.title,
        description: data.body,
        created_at: dayjs().format(),
        read: false,
      };
      notifications.value.unshift(newNotification);
      hasNewNotifications.value = true;
    }
  };
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
