import { useAggregation } from "../../hooks/useAggregation";
import { useCampaignData } from "../../hooks/useCampaignData";
import AggregationControls from "./components/AggregationControls";
import DataTable from "./components/DataTable/DataTable";
import TimelineChart from "./TimelineChart/TimelineChart";

function DashboardPage() {
  const { loading, error, metadata, metrics } = useCampaignData();
  const { mode, setMode, metricField, setMetricField, buckets } =
    useAggregation(metrics);

  return (
    <div className="dashboard">
      <section className="dashboard__controls">
        <AggregationControls
          mode={mode}
          onModeChange={setMode}
          metricField={metricField}
          onMetricFieldChange={setMetricField}
        />
      </section>

      <section className="dashboard__chart">
        <TimelineChart buckets={buckets} metricField={metricField} />
      </section>

      <section className="dashboard__table">
        <DataTable buckets={buckets} mode={mode} />
      </section>
    </div>
  );
}

export { DashboardPage };
