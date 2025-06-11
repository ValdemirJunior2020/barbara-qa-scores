import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const allAgents = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

          rows.forEach((row) => {
            const agentInfo = {
              center: sheetName,
              firstName:
                row.FN ||
                row.OnlyFN ||
                row.Al ||
                row['Green=Grp OnlyFN'] ||
                row['First Name'] ||
                '',
              lastName: row.LN || row['Last Name'] || '',
              supervisor:
                row.Supervisor ||
                row[' Supervisor'] ||
                row['Supervision'] ||
                row['Supervisor '] ||
                'Unknown',
            };

            const scoreEntries = Object.values(row).filter(
              (val) =>
                typeof val === 'string' &&
                (val.includes('CS>') || val.includes('G>'))
            );

            const validScores = [];

            scoreEntries.forEach((entry) => {
              const parts = entry.split('>');
              const scoreString = parts[2]?.trim();
              const scoreMatch = scoreString?.match(/^(\d{1,3})%$/);

              if (parts.length === 3 && scoreMatch) {
                validScores.push({
                  ...agentInfo,
                  type: parts[0].trim(),
                  date: parts[1].trim(),
                  score: parseInt(scoreMatch[1]),
                  note: '',
                });
              } else if (parts.length === 3) {
                allAgents.push({
                  ...agentInfo,
                  type: parts[0].trim(),
                  date: parts[1].trim(),
                  score: null,
                  note: `⚠️ Needs Review: "${parts[2].trim()}"`,
                });
              }
            });

            if (validScores.length > 0) {
              const latest = validScores.reduce((a, b) =>
                new Date(a.date) > new Date(b.date) ? a : b
              );
              allAgents.push(latest);
            }
          });
        });

        resolve(allAgents);
      } catch (err) {
        reject(err);
      }
    };

    reader.readAsArrayBuffer(file);
  });
};
