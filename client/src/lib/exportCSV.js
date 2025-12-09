export default function exportCSV(data, filename) {
  if (!data || !data.length) {
    alert('Không có dữ liệu để xuất');
    return;
  }
  var keys = Object.keys(data[0]);
  var csvRows = [keys.join(',')];
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var vals = [];
    for (var j = 0; j < keys.length; j++) {
      vals.push('"' + row[keys[j]] + '"');
    }
    csvRows.push(vals.join(','));
  }
  var csv = csvRows.join('\n');
  var blob = new Blob([csv], { type: 'text/csv' });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
