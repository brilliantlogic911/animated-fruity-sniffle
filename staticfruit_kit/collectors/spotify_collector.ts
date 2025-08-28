// collectors/spotify_collector.ts
// Use Spotify Web API to retrieve chart positions, followers, monthly listeners, etc.
export async function getSpotifyTrackMetrics(trackId: string) {
  return { track_id: trackId, rank_delta_7d: -5, playlist_adds_24h: 120, monthly_listeners: 5200000 };
}
