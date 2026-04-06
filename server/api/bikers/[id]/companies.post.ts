import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    if (auth.role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: "Forbidden: Admins only" });
    }

    const bikerId = getRouterParam(event, "id");
    const body = await readBody(event);
    const { companyIds } = body;

    if (!bikerId || !Array.isArray(companyIds)) {
      throw createError({ statusCode: 400, statusMessage: "Biker ID and companyIds array are required" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sync vinculations: delete old ones and insert new ones
    // We'll use a transaction if possible, but with Supabase Client 
    // it's easier to just delete and then insert.
    
    // 1. Delete all current vinculations for this biker
    const { error: deletionErr } = await supabase
      .from("biker_companies")
      .delete()
      .eq("biker_id", bikerId);

    if (deletionErr) throw deletionErr;

    // 2. Insert new vinculations
    if (companyIds.length > 0) {
      const vinculations = companyIds.map(cid => ({
        id: randomUUID(),
        biker_id: bikerId,
        company_id: cid,
        created_at: new Date().toISOString()
      }));

      const { error: insertErr } = await supabase
        .from("biker_companies")
        .insert(vinculations);

      if (insertErr) throw insertErr;
    }

    return { 
      success: true, 
      message: "Vinculações atualizadas com sucesso" 
    };

  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error syncing biker vinculations:", error);
    throw createError({ 
      statusCode: 500, 
      statusMessage: "Failed to sync vinculations",
      message: error.message || "Unknown error"
    });
  }
});
