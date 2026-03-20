import { createClient } from "@supabase/supabase-js";

interface CreateNotificationParams {
  userId: string;
  companyId?: string | null;
  title: string;
  description?: string;
  type?: string;
  data?: any;
}

/**
 * Creates a notification record in the database.
 * Optionally will send a push notification in the future when Firebase is configured.
 */
export async function createNotification(params: CreateNotificationParams) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidRegex.test(params.userId);
  const actualUserId = isUuid ? params.userId : "00000000-0000-0000-0000-000000000000";

  const { error } = await supabase.from("notifications").insert([
    {
      user_id: actualUserId,
      company_id: params.companyId || null,
      title: params.title,
      description: params.description || null,
      type: params.type || "info",
      read: false,
      data: params.data || null,
    },
  ]);

  if (error) {
    console.error("Error creating notification:", error);
  }

  // TODO: Send Firebase push notification here when configured
  // const tokens = await getUserPushTokens(params.userId);
  // if (tokens.length > 0) {
  //   await sendFCMNotification(tokens, params.title, params.description);
  // }
}
