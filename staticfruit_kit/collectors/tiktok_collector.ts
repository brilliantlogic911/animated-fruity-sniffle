// collectors/tiktok_collector.ts
// Choose a provider (RapidAPI, Apify) or your own Playwright scraper.
// Return: { sound_id, uses_24h, uses_delta_7d, creator_score }
export async function getTikTokSoundMetrics(soundId: string) {
  // TODO: implement with your provider
  return { sound_id: soundId, uses_24h: 3200, uses_delta_7d: 0.28, creator_score: 0.77 };
}
