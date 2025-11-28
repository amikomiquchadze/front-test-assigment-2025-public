import type { Campaign } from "../types/campaign";
import type { Metric } from "../types/metrics";

export interface MergedMetric extends Metric {
  campaignName: string;
  platform: string;
}

export function mergeCampaigns(
  campaigns: Campaign[],
  metrics: Metric[]
): MergedMetric[] {
  const map = new Map<string, Campaign>();
  for (const c of campaigns) map.set(c.id, c);

  return metrics.map((m) => {
    const c = map.get(m.campaignId);
    return {
      ...m,
      campaignName: c?.name ?? "Unknown",
      platform: c?.platform ?? "Unknown",
    };
  });
}
