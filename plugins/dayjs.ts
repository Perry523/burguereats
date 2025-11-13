import dayjs from "dayjs";
import ptbr from "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from 'dayjs/plugin/timezone';
import utc from "dayjs/plugin/utc";

export default defineNuxtPlugin(() => {
  dayjs.locale(ptbr);
  dayjs.extend(utc);
  dayjs.extend(timezone)
  dayjs.extend(utc)
  dayjs.extend(relativeTime);
  dayjs.locale('pt-br')
  dayjs.tz.setDefault('America/Sao_Paulo')
});
