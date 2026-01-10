ts
import { createClient } from "@supabase/supabase-js";

export async function GET() {

@@ -13,12 +12,15 @@
  }

  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from("tenants").select("id").limit(1);
  const { data, error } = await supabase
    .from("tenants")
    .select("id")
    .limit(1);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, rows: data?.length ?? 0 });
}
