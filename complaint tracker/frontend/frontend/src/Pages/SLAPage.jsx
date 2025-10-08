// frontend/src/pages/SLAPage.jsx
import React, { useEffect, useState } from 'react';
import { fetchSla } from '../api/slaApi.js';
import SLATable from '../Components/SLATable.jsx';

export default function SLAPage() {
  const [data, setData] = useState({
    threshold_hours: 24,
    total_open: 0,
    overdue_count: 0,
    posts: []
  });
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(72);

  useEffect(() => {
    setLoading(true);
    fetchSla(threshold)
      .then(payload => {
        setData(payload);
      })
      .catch(err => {
        console.error('SLA fetch error', err);
      })
      .finally(() => setLoading(false));
  }, [threshold]);

  return (
    <div className="sla-page" style={{ padding: 20 }}>
      <div className="sla-table-wrapper">
        <div className="sla-header">
          <div className="title">
            <h1>SLA Tracking</h1>
            <div className="small-muted" style={{ marginLeft: 8 }}>
              Monitor unresolved posts & overdue items
            </div>
          </div>

          <div className="sla-summary">
            <div className="sla-chip">
              Threshold hours:
              <input
                style={{
                  marginLeft: 8,
                  width: 72,
                  padding: 6,
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'transparent',
                  color: 'var(--text)'
                }}
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value || 0))}
              />
            </div>

            <div className="sla-chip">
              Open: <strong style={{ marginLeft: 6 }}>{data.total_open}</strong>
            </div>
            <div className="sla-chip">
              Overdue: <strong style={{ marginLeft: 6 }}>{data.overdue_count}</strong>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>Loading...</div>
        ) : (
          <SLATable posts={data.posts || []} />
        )}
      </div>
    </div>
  );
}
