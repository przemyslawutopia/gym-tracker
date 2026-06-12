function backupJSON() {
  const raw = localStorage.getItem('gymtracker_v1') || '{}';
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gym_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function restoreJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        JSON.parse(ev.target.result);
        localStorage.setItem('gymtracker_v1', ev.target.result);
        alert('Restore complete. Reloading…');
        location.reload();
      } catch {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function exportToXlsx() {
  const rows = Storage.getAllFlat();
  if (rows.length === 0) {
    alert('No data to export yet.');
    return;
  }

  const headers = ['Date', 'Day', 'Exercise', 'Variant', 'Planned Variant', 'Set #', 'kg', 'Reps', 'RIR', 'Notes'];
  const data = [
    headers,
    ...rows.map(r => [r.date, r.day, r.exercise, r.variant, r.planned_variant, r.set_num, r.kg, r.reps, r.rir, r.notes])
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!cols'] = [
    { wch: 12 }, { wch: 6 }, { wch: 28 }, { wch: 26 }, { wch: 26 },
    { wch: 6 }, { wch: 6 }, { wch: 6 }, { wch: 6 }, { wch: 40 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Workouts');
  XLSX.writeFile(wb, `gym_tracker_export.xlsx`);
}
