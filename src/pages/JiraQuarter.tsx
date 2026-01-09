import { useNavigate, useParams } from "react-router-dom";
import epics from "../data/jira/q4-2025-epics.json";

const QUARTERS = ["q1", "q2", "q3", "q4"] as const;

export function JiraQuarter() {
  const navigate = useNavigate();
  const { year, quarter } = useParams();

  const currentYear = String(new Date().getFullYear());
  const safeYear = year ?? currentYear;

  const q = (quarter ?? "q1").toLowerCase();
  const safeQuarter = (QUARTERS as readonly string[]).includes(q) ? q : "q1";

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        Jira Epics — {safeYear} {safeQuarter.toUpperCase()}
      </h1>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <label>
          Year{" "}
          <input
            value={safeYear}
            onChange={(e) => navigate(`/jira/${e.target.value}/${safeQuarter}`)}
            style={{ width: 110, padding: 6 }}
          />
        </label>

        <label>
          Quarter{" "}
          <select
            value={safeQuarter}
            onChange={(e) => navigate(`/jira/${safeYear}/${e.target.value}`)}
            style={{ padding: 6 }}
          >
            {QUARTERS.map((qq) => (
              <option key={qq} value={qq}>
                {qq.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p style={{ marginTop: 12, color: "#666" }}>
        Loaded epics (mock for now): {epics.length}
      </p>
    </main>
  );
}
