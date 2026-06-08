function exportToXlsx() {
  const rows = Storage.getAllFlat();
  if (rows.length === 0) {
    alert('No data to export yet.');
    return;
  }

  const headers = ['Date', 'Day', 'Exercise', 'Set #', 'kg', 'Reps', 'RIR', 'Notes'];
  const data = [
    headers,
    ...rows.map(r => [r.date, r.day, r.exercise, r.set_num, r.kg, r.reps, r.rir, r.notes])
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Column widths
  ws['!cols'] = [
    { wch: 12 }, { wch: 6 }, { wch: 28 }, { wch: 6 },
    { wch: 6 }, { wch: 6 }, { wch: 6 }, { wch: 40 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Workouts');
  XLSX.writeFile(wb, `gym_tracker_export.xlsx`);
}
