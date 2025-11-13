import { configure } from "vee-validate";
import { localize } from "@vee-validate/i18n";
import ptbr from "@vee-validate/i18n/dist/locale/pt_BR.json";
export default defineNuxtPlugin(() => {
  configure({
    generateMessage: localize({
      ptbr,
    }),
  });
});
