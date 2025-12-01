// src/utils/dateHelpers.ts
import type { AggregationMode } from "../types/aggregation";

export function getBucketStart(date: Date, mode: AggregationMode): Date {
  const d = new Date(date);

  switch (mode) {
    case "hourly":
      d.setMinutes(0, 0, 0);
      return d;
    case "daily":
      d.setHours(0, 0, 0, 0);
      return d;
    case "weekly": {
      const day = d.getDay() || 7;
      if (day !== 1) d.setDate(d.getDate() - (day - 1));
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "monthly":
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
  }
}

export function addBucketStep(start: Date, mode: AggregationMode): Date {
  const d = new Date(start);

  switch (mode) {
    case "hourly":
      d.setHours(d.getHours() + 1);
      return d;
    case "daily":
      d.setDate(d.getDate() + 1);
      return d;
    case "weekly":
      d.setDate(d.getDate() + 7);
      return d;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      return d;
  }
}

export function formatBucketLabel(
  mode: AggregationMode,
  start: Date,
  end: Date
): string {
  switch (mode) {
    case "hourly":
      return start.toLocaleString(undefined, {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
      });
    case "daily":
      return start.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    case "weekly":
      const endDisplay = new Date(end);
      endDisplay.setDate(endDisplay.getDate() - 1);
      return `${start.toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
      })} – ${endDisplay.toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
      })}`;
    case "monthly":
      return start.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
  }
}
