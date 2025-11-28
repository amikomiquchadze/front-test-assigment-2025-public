import { useMemo, useState } from "react";
import type {
  AggregationMode,
  AggregatedBucket,
  MetricField,
} from "../data/types/aggregation";
import type { MergedMetric } from "../data/utils/mergeCampaigns";
import { aggregateMetrics } from "../data/utils/aggregateMetrics";

interface UseAggregationResult {
  mode: AggregationMode;
  setMode: (mode: AggregationMode) => void;
  metricField: MetricField;
  setMetricField: (field: MetricField) => void;
  buckets: AggregatedBucket[];
}

export function useAggregation(metrics: MergedMetric[]): UseAggregationResult {
  const [mode, setMode] = useState<AggregationMode>("daily");
  const [metricField, setMetricField] = useState<MetricField>("clicks");

  const buckets = useMemo(
    () => aggregateMetrics(metrics, mode),
    [metrics, mode]
  );

  return { mode, setMode, metricField, setMetricField, buckets };
}
