export type AggregationMode = "hourly" | "daily" | "weekly" | "monthly";
export type MetricField = "impressions" | "clicks" | "revenue";
export interface AggregatedBucket {
  key: string;
  start: Date;
  end: Date;
  label: string;
  impressions: number;
  clicks: number;
  revenue: number;
  campaignsActive: number;
}