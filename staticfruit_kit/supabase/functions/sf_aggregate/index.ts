// supabase/functions/sf_aggregate/index.ts
// Deno Edge Function that aggregates market pools, leaderboard, and odds drift.
// Run on schedule (Supabase Scheduled Functions) or called by GitHub Action.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type BetRow = { ts: string; onchain_id: number; address: string; amount: number; outcome: number; odds_yes_estimate?: number | null };
type PoolRow = { market_id: number; pool_yes: number; pool_no: number; pool_total: number };

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE")!;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { global: { fetch } });

  // Pull wagers + markets
  const { data: wagers, error: werr } = await supabase.from("wagers").select("ts,onchain_id,address,amount,outcome,odds_yes_estimate");
  if (werr) return new Response(`wagers error: ${werr.message}`, { status: 500 });
  const { data: markets, error: merr } = await supabase.from("markets").select("onchain_id,title,deadline");
  if (merr) return new Response(`markets error: ${merr.message}`, { status: 500 });

  // Aggregate in memory
  const pools: Record<number, PoolRow> = {};
  const leaderboard: Record<string, number> = {};

  for (const w of (wagers as BetRow[])) {
    const mId = w.onchain_id;
    pools[mId] ||= { market_id: mId, pool_yes: 0, pool_no: 0, pool_total: 0 };
    if (w.outcome === 1) pools[mId].pool_yes += Number(w.amount);
    else pools[mId].pool_no += Number(w.amount);
    pools[mId].pool_total = pools[mId].pool_yes + pools[mId].pool_no;

    leaderboard[w.address] = (leaderboard[w.address] || 0) + Number(w.amount);
  }

  // Upsert aggregates
  const poolArr = Object.values(pools);
  const lbArr = Object.entries(leaderboard).map(([address, total]) => ({ address, total_staked: total }));

  // Create tables if not exist (idempotent-ish): handled migrations ideally. Here we try simple upserts.
  const { error: perr } = await supabase.from("market_pools").upsert(poolArr, { onConflict: "market_id" });
  if (perr) return new Response(`market_pools error: ${perr.message}`, { status: 500 });

  // wipe + insert leaderboard top 100
  await supabase.from("leaderboard").delete().neq("address", ""); // simple truncate
  const { error: lerr } = await supabase.from("leaderboard").insert(lbArr.sort((a,b)=>b.total_staked-a.total_staked).slice(0,100));
  if (lerr) return new Response(`leaderboard error: ${lerr.message}`, { status: 500 });

  return new Response(JSON.stringify({ ok: true, pools: poolArr.length, leaderboard: lbArr.length }), {
    headers: { "content-type": "application/json" },
  });
});
