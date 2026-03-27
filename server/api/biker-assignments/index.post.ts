import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  try {
    const auth = requireAuth(event);
    const body = await readBody(event);

    const { biker_id, company_id, date } = body;

    if (!biker_id || !company_id || !date) {
      throw createError({
        statusCode: 400,
        statusMessage: "biker_id, company_id and date are required",
      });
    }

    // Managers can only assign bikers to their own company
    if (auth.role === "manager" && company_id !== auth.companyId) {
      throw createError({
        statusCode: 403,
        statusMessage: "You can only assign bikers to your own company",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase configuration");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get the target company's operating hours
    const { data: targetCompany, error: targetErr } = await supabase
      .from("Company")
      .select("id, name, operating_hours")
      .eq("id", company_id)
      .single();

    if (targetErr || !targetCompany) {
      throw createError({ statusCode: 404, statusMessage: "Company not found" });
    }

    // Determine day of week (0=Sunday, 1=Monday, ... 6=Saturday)
    const assignmentDate = new Date(date + "T12:00:00Z"); // noon UTC to avoid timezone issues
    const dayOfWeek = assignmentDate.getUTCDay();

    const targetHours = targetCompany.operating_hours?.[dayOfWeek];

    if (!targetHours || !targetHours.open_time || !targetHours.close_time) {
      throw createError({
        statusCode: 400,
        statusMessage: `A empresa "${targetCompany.name}" não possui horário de funcionamento configurado para este dia da semana.`,
      });
    }

    // 2. Get all existing CONFIRMED assignments for this biker on this date
    const { data: existingAssignments, error: existErr } = await supabase
      .from("biker_assignments")
      .select("*")
      .eq("biker_id", biker_id)
      .eq("date", date)
      .eq("status", "confirmado");

    if (existErr) throw existErr;

    // 3. Check for time conflicts
    if (existingAssignments && existingAssignments.length > 0) {
      const conflictCompanyIds = existingAssignments.map((a: any) => a.company_id);

      const { data: existingCompanies } = await supabase
        .from("Company")
        .select("id, name, operating_hours")
        .in("id", conflictCompanyIds);

      if (existingCompanies) {
        for (const ec of existingCompanies) {
          const ecHours = ec.operating_hours?.[dayOfWeek];
          if (!ecHours || !ecHours.open_time || !ecHours.close_time) continue;

          // Check overlap: A.open < B.close && B.open < A.close
          const tOpen = targetHours.open_time;
          const tClose = targetHours.close_time;
          const eOpen = ecHours.open_time;
          const eClose = ecHours.close_time;

          if (tOpen < eClose && eOpen < tClose) {
            throw createError({
              statusCode: 400,
              statusMessage: `Conflito de horário! O entregador já está escalado para "${ec.name}" das ${eOpen} às ${eClose} neste dia, que conflita com o horário ${tOpen}-${tClose}.`,
            });
          }
        }
      }
    }

    // 4. Check if already assigned to this same company on this date
    const alreadyAssigned = existingAssignments?.find(
      (a: any) => a.company_id === company_id
    );
    if (alreadyAssigned) {
      throw createError({
        statusCode: 400,
        statusMessage: "Este entregador já está vinculado a essa empresa neste dia.",
      });
    }

    // 5. Create the assignment
    const { data: assignment, error: insertErr } = await supabase
      .from("biker_assignments")
      .insert({
        id: randomUUID(),
        biker_id,
        company_id,
        date,
        status: "confirmado",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return { success: true, data: assignment };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error creating biker assignment:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create biker assignment",
    });
  }
});
