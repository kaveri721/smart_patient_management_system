import React, { useEffect, useState } from 'react';

const API = 'http://127.0.0.1:8000/api';

export default function App() {
  const [analytics, setAnalytics] = useState(null);
  const [queueMonitoring, setQueueMonitoring] = useState({ doctors: [] });

  useEffect(() => {
    fetch(`${API}/admin/analytics/dashboard`).then(r => r.json()).then(setAnalytics).catch(() => setAnalytics(null));
    fetch(`${API}/admin/queue/monitoring`).then(r => r.json()).then(setQueueMonitoring).catch(() => setQueueMonitoring({ doctors: [] }));
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f8fafc', minHeight: '100vh', padding: 24 }}>
      <h1 style={{ color: '#0f172a' }}>Hospital Operations Control Panel</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
        <Card title="Total Patients Today" value={analytics?.total_patients_today ?? '--'} />
        <Card title="Average Waiting Time" value={analytics ? `${analytics.avg_waiting_time} min` : '--'} />
        <Card title="Active Queue Length" value={analytics?.active_queue_length ?? '--'} />
        <Card title="Completed Consultations" value={analytics?.completed_consultations ?? '--'} />
      </div>
      <h2 style={{ marginTop: 28 }}>Doctor Monitoring</h2>
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        {(queueMonitoring.doctors || []).length === 0 ? <p>No doctors found</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Doctor</th><th align="left">Specialization</th><th align="left">Available</th><th align="left">Waiting</th>
              </tr>
            </thead>
            <tbody>
              {queueMonitoring.doctors.map((d) => (
                <tr key={d.doctor_id}>
                  <td>{d.doctor_name}</td>
                  <td>{d.specialization}</td>
                  <td>{String(d.is_available)}</td>
                  <td>{d.waiting_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <p style={{ color: '#64748b', margin: 0 }}>{title}</p>
      <h2 style={{ margin: '10px 0 0', color: '#2563EB' }}>{value}</h2>
    </div>
  );
}
