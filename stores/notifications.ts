// store.ts
import { defineStore } from "pinia";
type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
};
export const useNotifications = defineStore("notifications", {
  state: () => ({
    notifications: [] as Notification[],
    hasNewNotifications: false,
  }),
  getters: {
    newNotifications: (state) =>
      state.notifications.filter((notification) => !notification.read),
  },
  actions: {
    setNotifications(notifications: Notification[]) {
      this.notifications = notifications;
    },
  },
});
