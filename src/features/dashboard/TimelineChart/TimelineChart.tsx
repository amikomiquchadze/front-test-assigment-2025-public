import { useMemo } from "react";
import type {
  AggregatedBucket,
  MetricField,
} from "../../../data/types/aggregation";
import styles from "./TimelineChart.module.css";

type TimelineChartProps = {
  buckets: AggregatedBucket[];
  metricField: MetricField;
};

const WIDTH = 800;
const HEIGHT = 260;
const PADDING_LEFT = 50;
const PADDING_RIGHT = 20;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 40;

function TimelineChart({ buckets, metricField }: TimelineChartProps) {
  const { points, maxValue } = useMemo(() => {
    if (buckets.length === 0) return { points: [], maxValue: 0 };
    const values = buckets.map((b) => b[metricField]);
    const max = Math.max(...values, 0);
    const innerWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
    const innerHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    const points = buckets.map((bucket, index) => {
      const x =
        PADDING_LEFT +
        (buckets.length === 1
          ? innerWidth / 2
          : (index / (buckets.length - 1)) * innerWidth);
      const value = bucket[metricField];
      const ratio = max === 0 ? 0 : value / max;
      const y = PADDING_TOP + (1 - ratio) * innerHeight;
      return { x, y };
    });

    return { points, maxValue: max };
  }, [buckets, metricField]);

  const yTicks = useMemo(() => {
    const ticks = 4;
    const values: { y: number; label: string }[] = [];
    const innerHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    for (let i = 0; i <= ticks; i++) {
      const ratio = i / ticks;
      const y = PADDING_TOP + (1 - ratio) * innerHeight;
      values.push({ y, label: formatNumberShort(maxValue * ratio) });
    }
    return values;
  }, [maxValue]);

  const xLabels = useMemo(() => {
    if (!buckets.length) return [];
    const maxLabels = 6;
    const step =
      buckets.length <= maxLabels ? 1 : Math.ceil(buckets.length / maxLabels);
    const innerWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;

    return buckets
      .map((bucket, index) => {
        if (index % step !== 0 && index !== buckets.length - 1) return null;
        const x =
          PADDING_LEFT +
          (buckets.length === 1
            ? innerWidth / 2
            : (index / (buckets.length - 1)) * innerWidth);
        return { x, label: bucket.label };
      })
      .filter(Boolean) as { x: number; label: string }[];
  }, [buckets]);

  const pathD = useMemo(() => {
    if (!points.length) return "";
    if (points.length === 1) {
      const p = points[0];
      return `M ${p.x} ${p.y} L ${p.x + 0.01} ${p.y}`;
    }
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
  }, [points]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {metricFieldLabel(metricField)} over time
        </h2>
        <p className={styles.subtitle}>Custom SVG chart</p>
      </div>

      {buckets.length === 0 ? (
        <p className={styles.noData}>No data to display.</p>
      ) : (
        <div className={styles.svgContainer}>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className={styles.timelineSvg}
            role="img"
            aria-label={`Timeline of ${metricFieldLabel(metricField)}`}
          >
            <rect
              x={0}
              y={0}
              width={WIDTH}
              height={HEIGHT}
              fill="var(--color-surface, #0b1120)"
              rx={12}
            />

            {yTicks.map((tick, idx) => (
              <g key={idx}>
                <line
                  x1={PADDING_LEFT}
                  x2={WIDTH - PADDING_RIGHT}
                  y1={tick.y}
                  y2={tick.y}
                  stroke="rgba(148, 163, 184, 0.25)"
                  strokeWidth={1}
                />
                <text
                  x={PADDING_LEFT - 8}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="#94a3b8"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            <line
              x1={PADDING_LEFT}
              x2={WIDTH - PADDING_RIGHT}
              y1={HEIGHT - PADDING_BOTTOM}
              y2={HEIGHT - PADDING_BOTTOM}
              stroke="#64748b"
              strokeWidth={1.2}
            />

            {xLabels.map((tick, idx) => (
              <text
                key={idx}
                x={tick.x}
                y={HEIGHT - PADDING_BOTTOM + 16}
                textAnchor="middle"
                fontSize={10}
                fill="#94a3b8"
              >
                {tick.label}
              </text>
            ))}

            <path
              d={pathD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {points.map((p, idx) => (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={3}
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth={1}
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

function metricFieldLabel(field: MetricField): string {
  switch (field) {
    case "impressions":
      return "Impressions";
    case "clicks":
      return "Clicks";
    case "revenue":
      return "Revenue";
  }
}

function formatNumberShort(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
  return Math.round(value).toString();
}

export default TimelineChart;
