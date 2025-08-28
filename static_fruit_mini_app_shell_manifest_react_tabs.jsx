// ========================
// File: public/miniapp/manifest.json (copy into your app's public dir)
// ========================
/*
{
  "id": "staticfruit",
  "name": "StaticFruit",
  "icon": "https://staticfruit.xyz/icon.png",
  "description": "Hip Hop Horoscope • Base the Bars • Gossip Markets",
  "homepage": "https://staticfruit.xyz",
  "tabs": [
    { "title": "Home", "url": "https://staticfruit.xyz" },
    { "title": "Horoscope", "url": "https://staticfruit.xyz/horoscope" },
    { "title": "Bars", "url": "https://staticfruit.xyz/bars" },
    { "title": "Markets", "url": "https://staticfruit.xyz/markets" }
  ],
  "og": {
    "title": "StaticFruit",
    "image": "https://staticfruit.xyz/og.png",
    "description": "Daily Fruit Signs, Weekly Bars, Culture Bets on Base"
  }
}
*/

// ========================
// File: src/components/StaticFruitApp.tsx
// ========================
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flame, Stars, Music2, BarChart3, Coins, Share2, Crown, Zap } from "lucide-react";
import { motion } from "framer-motion";
// (Optional) charts
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Deep Space palette helpers
const cardClass = "rounded-2xl shadow-lg bg-[#0d1117] text-[#e6edf3] border border-white/10";
const primary = "bg-[#61dafb] text-[#0d1117] hover:opacity-90";
const accent = "bg-[#bd83e8] text-white hover:opacity-90";

// Demo data (replace with live indexer/API results)
const oddsData = [
  { day: "D1", yes: 0.44 },
  { day: "D2", yes: 0.48 },
  { day: "D3", yes: 0.53 },
  { day: "D4", yes: 0.59 },
  { day: "D5", yes: 0.62 },
];

const poolsData = [
  { market: "Nicki Collab", yes: 12430, no: 8110 },
  { market: "Utopia 2", yes: 17890, no: 12200 },
  { market: "TikTok 100k", yes: 9200, no: 5400 },
];

const ActivityRow: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; cta?: React.ReactNode }>= ({ icon, title, subtitle, cta }) => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-white/60">{subtitle}</div>
      </div>
    </div>
    {cta}
  </div>
);

export default function StaticFruitApp() {
  return (
    <div className="min-h-screen w-full bg-[#0d1117] text-[#e6edf3]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 140 }} className="h-10 w-10 rounded-2xl bg-[#61dafb] flex items-center justify-center text-[#0d1117] font-black">SF</motion.div>
            <div>
              <div className="text-xl font-bold">StaticFruit</div>
              <div className="text-xs text-white/60">Hip Hop Horoscope • Base the Bars • Markets</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button className={`${primary} rounded-xl`}>Connect</Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid grid-cols-4 bg-white/5 rounded-2xl p-1">
            <TabsTrigger value="home" className="rounded-xl data-[state=active]:bg-white/10">Home</TabsTrigger>
            <TabsTrigger value="horoscope" className="rounded-xl data-[state=active]:bg-white/10">Horoscope</TabsTrigger>
            <TabsTrigger value="bars" className="rounded-xl data-[state=active]:bg-white/10">Bars</TabsTrigger>
            <TabsTrigger value="markets" className="rounded-xl data-[state=active]:bg-white/10">Markets</TabsTrigger>
          </TabsList>

          {/* HOME */}
          <TabsContent value="home" className="mt-6 grid md:grid-cols-3 gap-4">
            <Card className={`${cardClass} md:col-span-2`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stars className="h-5 w-5"/> Today’s Fruit Sign</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="text-sm">♌ Leo • Theme: Hustle</div>
                    <div className="text-2xl font-semibold leading-snug">“Move quiet, stack louder — star maps in the ledger.”</div>
                    <div className="text-xs text-white/60">Money ↑ • Love → • Hustle ↑↑</div>
                    <div className="flex gap-2 pt-2">
                      <Button className={`${primary} rounded-xl`}>Claim on Base</Button>
                      <Button variant="ghost" className="rounded-xl"><Share2 className="h-4 w-4 mr-2"/>Share</Button>
                    </div>
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={oddsData}>
                        <XAxis dataKey="day"/>
                        <YAxis domain={[0,1]}/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="yes" dot />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="text-xs text-white/60 mt-2">Sample odds drift (demo)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5"/> Trending Bars</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityRow icon={<Music2 className="h-4 w-4"/>} title="@luna • Week 34" subtitle="“On Base I move silent like gasless txns”" cta={<Button size="sm" variant="outline" className="rounded-xl">Give 🔥</Button>} />
                <ActivityRow icon={<Music2 className="h-4 w-4"/>} title="@mike • Week 34" subtitle="“Cold wallet pockets, warm jet streams”" cta={<Button size="sm" variant="outline" className="rounded-xl">Give 🔥</Button>} />
                <div className="pt-2"><Button className={`${accent} rounded-xl w-full`}>Open Bars</Button></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HOROSCOPE */}
          <TabsContent value="horoscope" className="mt-6 grid md:grid-cols-3 gap-4">
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stars className="h-5 w-5"/> Generate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Sign (e.g., leo)" className="rounded-xl bg-white/5 border-white/10"/>
                <Input type="date" className="rounded-xl bg-white/5 border-white/10"/>
                <Button className={`${primary} rounded-xl w-full`}>Get Horoscope</Button>
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader><CardTitle>Today’s Drop</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm">♑ Capricorn • Theme: Momentum</div>
                <div className="text-xl font-semibold py-2">“New blocks every day — you’re lapping latency.”</div>
                <div className="flex gap-2">
                  <Button className={`${primary} rounded-xl`}>Claim on Base</Button>
                  <Button variant="ghost" className="rounded-xl"><Share2 className="h-4 w-4 mr-2"/>Share</Button>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader><CardTitle>Streaks</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm"><Zap className="h-4 w-4"/> 7‑day streak unlocked</div>
                <div className="flex items-center gap-2 text-sm"><Crown className="h-4 w-4"/> Prophet badge eligible</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BARS */}
          <TabsContent value="bars" className="mt-6 grid md:grid-cols-3 gap-4">
            <Card className={`${cardClass} md:col-span-2`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Music2 className="h-5 w-5"/> Drop a Juice Bar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea maxLength={280} placeholder="Drop your 280‑char punchline…" className="min-h-[120px] rounded-xl bg-white/5 border-white/10"/>
                <div className="flex gap-2">
                  <Button className={`${primary} rounded-xl`}>Mint Bar</Button>
                  <Button variant="outline" className="rounded-xl">AI Punch‑Up</Button>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader><CardTitle>Leaderboard</CardTitle></CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={poolsData}>
                      <XAxis dataKey="market" hide/>
                      <YAxis hide/>
                      <Tooltip/>
                      <Bar dataKey="yes"/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-white/60 mt-2">Weekly 🔥 (demo)</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MARKETS */}
          <TabsContent value="markets" className="mt-6 grid md:grid-cols-2 gap-4">
            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> Nicki surprise collab by Oct 31?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-white/80">Odds (demo): YES 62% • NO 38%</div>
                <div className="flex gap-2">
                  <Button className={`${primary} rounded-xl`}><Coins className="h-4 w-4 mr-2"/>Back YES</Button>
                  <Button variant="outline" className="rounded-xl">Back NO</Button>
                </div>
              </CardContent>
            </Card>

            <Card className={cardClass}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> TikTok sound hits 100k in 7 days?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-white/80">Odds (demo): YES 44% • NO 56%</div>
                <div className="flex gap-2">
                  <Button className={`${primary} rounded-xl`}><Coins className="h-4 w-4 mr-2"/>Back YES</Button>
                  <Button variant="outline" className="rounded-xl">Back NO</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-white/50">© {new Date().getFullYear()} StaticFruit • Powered by Base</div>
      </div>
    </div>
  );
}
