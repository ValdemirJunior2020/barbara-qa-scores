import React, { useState, useEffect } from 'react';
import FileUploader from './components/FileUploader';
import AgentTable from './components/AgentTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import ChartComponent from './components/ChartComponent';
import ExportButtons from './components/ExportButtons';
import { parseExcelFile } from './utils/parseExcel';

const App = () => {
  const [agentData, setAgentData] = useState([]);

  const handleDataParsed = (parsedAgents) => {
    setAgentData(parsedAgents);
  };

  // ✅ Load default Excel from /public
  useEffect(() => {
    const fetchDefault = async () => {
      const res = await fetch('/default-data.xlsx');
      const blob = await res.blob();
      const file = new File([blob], 'default-data.xlsx', { type: blob.type });
      const parsed = await parseExcelFile(file);
      setAgentData(parsed);
    };

    fetchDefault();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">QA Agent Performance Dashboard</h2>
      <FileUploader onDataParsed={handleDataParsed} />
      {agentData.length > 0 && (
        <>
          <ChartComponent agents={agentData} />
          <ExportButtons data={agentData} />
        </>
      )}
      <AgentTable agents={agentData} />
    </div>
  );
};

export default App;
