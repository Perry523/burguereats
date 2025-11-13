import { defineStore } from "pinia";
// const defaultNotify = "/songs/notify.mp3";

export const useCompanyStore = defineStore("company", {
  state: () => ({
    name: "",
    logo: "",
    banner: "",
    whatsapp: "",
    instagram: "",
    sunday_time: "",
    sunday_pause: "",
    monday_time: "",
    monday_pause: "",
    tuesday_time: "",
    tuesday_pause: "",
    thursday_time: "",
    thursday_pause: "",
    wednesday_time: "",
    wednesday_pause: "",
    friday_time: "",
    friday_pause: "",
    saturday_time: "",
    saturday_pause: "",
    buttons_color: "",
    background_color: "",
    cards_color: "",
    description: "",
    slug: "",
  }),
  // getters: {
  //   isLoggedIn: (state) => !!state.token.length,
  // },
  actions: {
    updateConfig(payload: Company) {
      const state = {
        // colors: this.colors,
        ...payload,
        logo: this.logo,
      };
      this.$state = state;
    },
    // setConfigs(payload: { new_order: string; logo: string; colors: object }) {
    // this.new_order = payload.new_order || defaultNotify;
    // },
  },
  persist: true,
});
