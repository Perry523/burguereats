import { defineStore } from "pinia";

interface Notification {
  id: string;
  user_id: string;
  company_id: string | null;
  title: string;
  description: string | null;
  type: string;
  read: boolean;
  data: any;
  created_at: string;
}

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as Notification[],
    isLoading: false,
    hasNewNotifications: false,
  }),
  getters: {
    unreadNotifications: (state) =>
      state.notifications.filter((n) => !n.read),
    unreadCount: (state) =>
      state.notifications.filter((n) => !n.read).length,
  },
  actions: {
    async fetchNotifications() {
      this.isLoading = true;
      try {
        const res = await $fetch<{ success: boolean; data: Notification[] }>(
          "/api/notifications"
        );
        if (res.success) {
          const hadUnread = this.unreadCount;
          this.notifications = res.data;
          if (this.unreadCount > hadUnread) {
            this.hasNewNotifications = true;
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async markAsRead(notificationId?: string) {
      try {
        await $fetch("/api/notifications/read", {
          method: "POST",
          body: { notificationId },
        });

        if (notificationId) {
          const n = this.notifications.find((n) => n.id === notificationId);
          if (n) n.read = true;
        } else {
          this.notifications.forEach((n) => (n.read = true));
        }
        this.hasNewNotifications = false;
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    addNotification(notification: Notification) {
      this.notifications.unshift(notification);
      this.hasNewNotifications = true;
    },
  },
});
