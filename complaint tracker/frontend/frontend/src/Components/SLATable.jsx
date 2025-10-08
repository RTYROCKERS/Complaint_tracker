// frontend/src/components/SLATable.jsx
import React from 'react';
import './sla.css';

function StatusBadge({ status }) {
  const cls = status ? status.toLowerCase().replace(/\s+/g, '_') : 'pending';
  return <span className={`badge ${cls}`}>{status}</span>;
}

function SeverityChip({ days_required }) {
  if (days_required == null) return <span className="small-muted">—</span>;
  const cls =
    days_required >= 7 ? 'days_required days_required-high'
    : days_required >= 4 ? 'days_required days_required-medium'
    : 'days_required days_required-low';
  return <span className={cls}>{days_required}</span>;
}

function Row({ p }) {
  return (
    <tr className={p.overdue ? 'sla-overdue' : ''}>
      <td style={{ width: 70 }}>{p.post_id}</td>
      <td>
        <div style={{ fontWeight: 700 }}>{p.title}</div>
        <div className="small-muted" style={{ marginTop: 6 }}>
          {p.description
            ? `${p.description.substring(0, 120)}${p.description.length > 120 ? '...' : ''}`
            : ''}
        </div>
      </td>
      <td>
        <div className="author">
          <div className="name">{p.author ? p.author.name : '—'}</div>
          <div className="meta">{p.created_at ? new Date(p.created_at).toLocaleString() : ''}</div>
        </div>
      </td>
      <td><StatusBadge status={p.status} /></td>
      <td>{p.hours_open}</td>
      <td><SeverityChip days_required={p.days_required} /></td>
      <td>{p.type || '—'}</td>
    </tr>
  );
}

export default function SLATable({ posts = [] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="sla-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Issue</th>
            <th>Author</th>
            <th>Status</th>
            <th>Hours open</th>
            <th>Days_Required</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <div className="sla-empty">No open posts</div>
              </td>
            </tr>
          ) : posts.map(p => <Row key={p.post_id} p={p} />)}
        </tbody>
      </table>
    </div>
  );
}
