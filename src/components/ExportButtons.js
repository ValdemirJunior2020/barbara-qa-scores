import React from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportButtons = ({ data }) => {
  const headers = [
    'Call Center',
    'First Name',
    'Last Name',
    'Supervisor',
    'Type',
    'Date',
    'Score',
    'Status',
  ];

  const rows = data.map((agent) => {
    const isCS = agent.type === 'CS';
    const isG = agent.type === 'G';
    const isBelow =
      (isCS && agent.score < 90) || (isG && agent.score < 85);

    return [
      agent.center,
      agent.firstName,
      agent.lastName,
      agent.supervisor,
      agent.type,
      agent.date,
      agent.score,
      isBelow ? '❌ Below KPI' : '✅ Pass',
    ];
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Agent QA Scores', 14, 10);
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
      styles: { fontSize: 8 },
    });
    doc.save('agent_scores.pdf');
  };

  return (
    <div className="mb-4 d-flex gap-2">
      <CSVLink data={[headers, ...rows]} filename="agent_scores.csv" className="btn btn-outline-primary">
        Export CSV
      </CSVLink>
      <button className="btn btn-outline-danger" onClick={downloadPDF}>
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
