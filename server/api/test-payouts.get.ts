import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export default defineEventHandler(async (event) => {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const dateFrom = "2026-03-30";
  const dateTo = "2026-04-05";
  const startOfDay = dayjs(dateFrom).startOf("day").toISOString();
  const endOfDay = dayjs(dateTo).endOf("day").toISOString();

  const query = supabase
    .from("biker_payouts")
    .select("*")
    .or(
      `and(week_from.gte.${dateFrom},week_from.lte.${dateTo}),` +
      `and(week_from.is.null,created_at.gte.${startOfDay},created_at.lte.${endOfDay})`
    );

  const { data, error } = await query;
  return { error, count: data?.length, data };
});
