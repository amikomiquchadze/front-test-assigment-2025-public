import styles from "./DataTable/DataTable.module.css";

type SortableHeaderProps = {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  align?: "left" | "right";
};
type SortDirection = "asc" | "desc";

function SortableHeader({
  label,
  active,
  direction,
  onClick,
  align = "left",
}: SortableHeaderProps) {
  return (
    <th
      onClick={onClick}
      className={`${styles.thBase} ${align === "right" ? styles.right : ""} ${
        active ? styles.active : styles.inactive
      }`}
    >
      <span className={styles.thContent}>
        {label}
        <span className={`${styles.arrow} ${active ? "active" : ""}`}>
          {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </span>
    </th>
  );
}

export default SortableHeader;
