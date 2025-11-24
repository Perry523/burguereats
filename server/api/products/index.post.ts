import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { company_id, name, category, sell_price, buy_price, stock, image } =
      body;

    if (
      !company_id ||
      !name ||
      !category ||
      sell_price === undefined ||
      buy_price === undefined ||
      stock === undefined
    ) {
      throw new Error("Missing required fields");
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Use service key to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          company_id,
          name,
          category,
          sell_price,
          buy_price,
          stock,
          image,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
});
