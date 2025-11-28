import { useEffect, useState } from "react";
import rawData from "../../public/data.json";

import type { Campaign } from "../data/types/campaign";
import type { Metric } from "../data/types/metrics";
import {
  mergeCampaigns,
  type MergedMetric,
} from "../data/utils/mergeCampaigns";

interface Metadata {
  description: string;
  generatedAt: string;
}

export interface UseCampaignDataState {
  loading: boolean;
  error: string | null;
  metadata: Metadata | null;
  metrics: MergedMetric[];
}

export function useCampaignData(): UseCampaignDataState {
  const [state, setState] = useState<UseCampaignDataState>({
    loading: true,
    error: null,
    metadata: null,
    metrics: [],
  });

  useEffect(() => {
    try {
      const file = rawData as {
        metadata?: Metadata;
        campaigns: Campaign[];
        metrics: Metric[];
      };

      const merged = mergeCampaigns(file.campaigns, file.metrics);

      setState({
        loading: false,
        error: null,
        metadata: file.metadata ?? null,
        metrics: merged,
      });
    } catch (err) {
      console.error(err);
      setState({
        loading: false,
        error: "Failed to load campaign data",
        metadata: null,
        metrics: [],
      });
    }
  }, []);

  return state;
}
