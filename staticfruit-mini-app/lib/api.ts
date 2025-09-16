export const API = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE || ""}${path}`;

export async function getHoroscope(sign: string, date: string): Promise<unknown> {
  const res = await fetch(API("/ai/horoscope"), { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ sign, date }) });
  return res.json();
}

export async function getTrendingBars(): Promise<unknown> {
  // replace with your endpoint
  return [{ user: "@luna", text: "On Base I move silent like gasless txns" }];
}

export async function getMarkets(): Promise<unknown> {
  // replace with your endpoint
  return [
    { id: 1, title: "Nicki surprise collab by Oct 31?", yes: 0.62 },
    { id: 2, title: "TikTok sound hits 100k in 7 days?", yes: 0.44 }
  ];
}
