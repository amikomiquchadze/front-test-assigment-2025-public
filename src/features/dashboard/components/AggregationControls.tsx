import type {
  AggregationMode,
  MetricField,
} from "../../../data/types/aggregation";

type Props = {
  mode: AggregationMode;
  onModeChange: (mode: AggregationMode) => void;
  metricField: MetricField;
  onMetricFieldChange: (field: MetricField) => void;
};

const MODES: AggregationMode[] = ["hourly", "daily", "weekly", "monthly"];
const METRICS: MetricField[] = ["impressions", "clicks", "revenue"];

function AggregationControls({
  mode,
  onModeChange,
  metricField,
  onMetricFieldChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid #1e293b",
              backgroundColor: mode === m ? "#0ea5e9" : "rgba(15,23,42,0.9)",
              color: mode === m ? "#0f172a" : "#e5e7eb",
              fontSize: 12,
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {METRICS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onMetricFieldChange(f)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid #1e293b",
              backgroundColor:
                metricField === f ? "#22c55e" : "rgba(15,23,42,0.9)",
              color: metricField === f ? "#022c22" : "#e5e7eb",
              fontSize: 12,
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AggregationControls;
