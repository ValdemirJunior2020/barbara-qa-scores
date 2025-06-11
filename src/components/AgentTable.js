import React, { useState } from 'react';

const AgentTable = ({ agents }) => {
  const [search, setSearch] = useState('');
  const [centerFilter, setCenterFilter] = useState('');
  const [supervisorFilter, setSupervisorFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const unique = (key) => [...new Set(agents.map((a) => a[key]).filter(Boolean))];

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filtered = agents
    .filter((a) =>
      `${a.firstName} ${a.lastName} ${a.supervisor} ${a.center}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((a) => (centerFilter ? a.center === centerFilter : true))
    .filter((a) => (supervisorFilter ? a.supervisor === supervisorFilter : true))
    .filter((a) => (typeFilter ? a.type === typeFilter : true))
    .sort((a, b) => {
      if (!sortKey) return 0;
      const x = a[sortKey];
      const y = b[sortKey];
      if (typeof x === 'number') return sortOrder === 'asc' ? x - y : y - x;
      return sortOrder === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
    });

  return (
    <div>
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Search by name, supervisor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => setCenterFilter(e.target.value)}>
            <option value="">All Centers</option>
            {unique('center').map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => setSupervisorFilter(e.target.value)}>
            <option value="">All Supervisors</option>
            {unique('supervisor').map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="CS">Customer Service (CS)</option>
            <option value="G">Groups (G)</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort('center')}>Center</th>
              <th onClick={() => handleSort('firstName')}>First Name</th>
              <th onClick={() => handleSort('lastName')}>Last Name</th>
              <th onClick={() => handleSort('supervisor')}>Supervisor</th>
              <th onClick={() => handleSort('type')}>Type</th>
              <th onClick={() => handleSort('date')}>Date</th>
              <th onClick={() => handleSort('score')}>Score</th>
              <th>Status</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((agent, index) => {
              const isCS = agent.type === 'CS';
              const isG = agent.type === 'G';
              const isBelowThreshold =
                (isCS && agent.score < 90) || (isG && agent.score < 85);
              const status = agent.score == null
                ? '⚠️ Review Needed'
                : isBelowThreshold
                ? '❌ Below KPI'
                : '✅ Pass';

              return (
                <tr
                  key={index}
                  className={
                    agent.score == null
                      ? 'table-warning'
                      : isBelowThreshold
                      ? 'table-danger'
                      : 'table-success'
                  }
                >
                  <td>{agent.center}</td>
                  <td>{agent.firstName}</td>
                  <td>{agent.lastName}</td>
                  <td>{agent.supervisor}</td>
                  <td>{agent.type}</td>
                  <td>{agent.date}</td>
                  <td>{agent.score !== null ? agent.score : '-'}</td>
                  <td>{status}</td>
                  <td>{agent.note || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentTable;
