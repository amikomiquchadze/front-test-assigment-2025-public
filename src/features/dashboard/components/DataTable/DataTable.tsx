import { useMemo, useState } from "react";
import type {
  AggregatedBucket,
  AggregationMode,
} from "../../../../data/types/aggregation";
import styles from "./DataTable.module.css";
import SortableHeader from "../SortableHeader";

type SortKey = "date" | "revenue";
type SortDirection = "asc" | "desc";

type DataTableProps = {
  buckets: AggregatedBucket[];
  mode: AggregationMode;
};

function DataTable({ buckets, mode }: DataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedRows = useMemo(() => {
    const copy = [...buckets];

    copy.sort((a, b) => {
      let cmp = 0;

      if (sortKey === "date") {
        cmp = a.start.getTime() - b.start.getTime();
      } else if (sortKey === "revenue") {
        cmp = a.revenue - b.revenue;
      }

      return sortDirection === "asc" ? cmp : -cmp;
    });

    return copy;
  }, [buckets, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const modeLabel = (() => {
    switch (mode) {
      case "hourly":
        return "Hour";
      case "daily":
        return "Day";
      case "weekly":
        return "Week";
      case "monthly":
        return "Month";
    }
  })();

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Aggregated {modeLabel} metrics</h2>
          <p className={styles.subtitle}>
            Rows represent aggregated {modeLabel.toLowerCase()} buckets. Sort by
            Date or Revenue.
          </p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <SortableHeader
                label="Date"
                active={sortKey === "date"}
                direction={sortDirection}
                onClick={() => handleSort("date")}
              />
              <th className={styles.thRight}>Campaigns Active</th>
              <th className={styles.thRight}>Total Impressions</th>
              <th className={styles.thRight}>Total Clicks</th>
              <SortableHeader
                label="Total Revenue"
                active={sortKey === "revenue"}
                direction={sortDirection}
                onClick={() => handleSort("revenue")}
                align="right"
              />
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  No data to display.
                </td>
              </tr>
            ) : (
              sortedRows.map((bucket, index) => (
                <tr
                  key={bucket.key}
                  className={index % 2 === 0 ? styles.row : styles.rowAlt}
                >
                  <td className={styles.tdLeft}>{bucket.label}</td>
                  <td className={styles.tdRight}>{bucket.campaignsActive}</td>
                  <td className={styles.tdRight}>
                    {bucket.impressions.toLocaleString()}
                  </td>
                  <td className={styles.tdRight}>
                    {bucket.clicks.toLocaleString()}
                  </td>
                  <td className={styles.tdRight}>
                    {bucket.revenue.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
