import React, { useEffect, useState } from "react";
import api from "../api";
import { Bar } from "react-chartjs-2";

export default function AdminDashboard() {

  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {

    async function loadAnalytics() {

      const res =
        await api.get(
          "/analytics/wait-times"
        );

      setWaitTime(res.data.avg_wait_time);
    }

    loadAnalytics();

  }, []);

  return (
    <div>

      <h2>Admin Dashboard</h2>

      <Bar
        data={{
          labels: ["Average Wait Time"],
          datasets: [
            {
              label: "Minutes",
              data: [waitTime]
            }
          ]
        }}
      />

    </div>
  );
}