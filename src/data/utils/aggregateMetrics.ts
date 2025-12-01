import type { AggregationMode, AggregatedBucket } from "../types/aggregation";
import type { MergedMetric } from "./mergeCampaigns";
import {
  getBucketStart,
  addBucketStep,
  formatBucketLabel,
} from "./dateHelpers";

export function aggregateMetrics(
  data: MergedMetric[],
  mode: AggregationMode
): AggregatedBucket[] {
  if (data.length === 0) return [];

  const buckets = new Map<string, AggregatedBucket>();
  const campaignMap = new Map<string, Set<string>>();

  for (const point of data) {
    const ts = new Date(point.timestamp);
    const start = getBucketStart(ts, mode);
    const end = addBucketStep(start, mode);
    const key = `${start.toISOString()}|${mode}`;

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = {
        key,
        start,
        end,
        label: formatBucketLabel(mode, start, end),
        impressions: 0,
        clicks: 0,
        revenue: 0,
        campaignsActive: 0,
      };
      buckets.set(key, bucket);
    }

    bucket.impressions += point.impressions;
    bucket.clicks += point.clicks;
    bucket.revenue += point.revenue;

    let set = campaignMap.get(key);
    if (!set) {
      set = new Set();
      campaignMap.set(key, set);
    }
    set.add(point.campaignId);
  }

  for (const [key, bucket] of buckets.entries()) {
    bucket.campaignsActive = campaignMap.get(key)?.size ?? 0;
  }

  return Array.from(buckets.values()).sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
}
