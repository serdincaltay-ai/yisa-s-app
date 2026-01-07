import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !serviceKey) {
    return Response.json(
      { ok: false, error: "Missing SUPABASE env vars" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from("tenants").select("id").limit(1);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, rows: data?.length ?? 0 });
}
