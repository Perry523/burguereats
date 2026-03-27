import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.name || !body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name and email are required",
      });
    }

    // Manager credentials are required to create a company
    if (!body.manager_name || !body.manager_email || !body.manager_password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Manager name, email and password are required",
      });
    }

    if (body.manager_password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: "Manager password must be at least 6 characters",
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Create the company
    const companyId = randomUUID();
    const { data: company, error: companyError } = await supabase
      .from("Company")
      .insert({
        id: companyId,
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (companyError) throw companyError;

    // 2. Create the manager user linked to this company
    const hashedPassword = await bcrypt.hash(body.manager_password, 10);
    const normalizedManagerEmail = body.manager_email.trim().toLowerCase();

    const { data: manager, error: managerError } = await supabase
      .from("Admins")
      .insert({
        id: randomUUID(),
        name: body.manager_name,
        email: normalizedManagerEmail,
        password: hashedPassword,
        phone: body.manager_phone || null,
        companyId: companyId,
        role: "manager",
        isActive: true,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (managerError) {
      // Rollback: delete the company if manager creation failed
      await supabase.from("Company").delete().eq("id", companyId);
      throw managerError;
    }

    return {
      success: true,
      data: {
        company,
        manager: { id: manager.id, name: manager.name, email: manager.email },
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error("Error creating company:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create company",
    });
  }
});
