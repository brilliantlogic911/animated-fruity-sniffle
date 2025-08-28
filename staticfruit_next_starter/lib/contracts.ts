export const ADDR = {
  SEEDS: process.env.NEXT_PUBLIC_SEEDS_ADDR as `0x${string}`,
  BARS: process.env.NEXT_PUBLIC_BARS_ADDR as `0x${string}`,
  PRESS: process.env.NEXT_PUBLIC_PRESS_ADDR as `0x${string}`,
  MARKETS: process.env.NEXT_PUBLIC_MARKETS_ADDR as `0x${string}`,
};
export const ABIS = {
  // drop your compiled ABIs here
  StaticSeeds: [] as const,
  JuiceBars: [] as const,
  JuicePress: [] as const,
  FruitMarkets: [] as const,
};
