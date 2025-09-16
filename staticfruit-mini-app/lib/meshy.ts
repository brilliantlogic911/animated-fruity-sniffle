// staticfruit_next_starter/lib/meshy.ts
export const API = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE || ""}${path}`;

export async function generateLogoTotem(): Promise<unknown> {
  const res = await fetch(API("/ai/nft-3d/logo-totem"), {
    method: "POST",
    headers: {"content-type":"application/json"}
  });
  return res.json();
}

export async function generateLegendaryNFTModel(nftId: number): Promise<unknown> {
  const res = await fetch(API(`/ai/nft-3d/legendary/${nftId}`), {
    method: "POST",
    headers: {"content-type":"application/json"}
  });
  return res.json();
}

export async function getModelStatus(taskId: string): Promise<unknown> {
  const res = await fetch(API(`/ai/nft-3d/status/${taskId}`), {
    method: "GET",
    headers: {"content-type":"application/json"}
  });
  return res.json();
}