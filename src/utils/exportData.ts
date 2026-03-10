import { showToast } from '../components/Toast';

type RepairRequest = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  equipment_type: string;
  equipment_make: string | null;
  equipment_model: string | null;
  service_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  issue_description: string;
};

export function exportToCSV(data: RepairRequest[], filename: string = 'export.csv') {
  if (data.length === 0) {
    showToast.warning('No data to export');
    return;
  }

  const headers = [
    'ID',
    'Customer Name',
    'Email',
    'Phone',
    'Equipment Type',
    'Make',
    'Model',
    'Service Type',
    'Status',
    'Issue Description',
    'Created Date',
    'Updated Date'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      `"${item.customer_name}"`,
      item.customer_email,
      item.customer_phone || '',
      `"${item.equipment_type}"`,
      item.equipment_make || '',
      item.equipment_model || '',
      item.service_type,
      item.status,
      `"${(item.issue_description || '').replace(/"/g, '""')}"`,
      new Date(item.created_at).toLocaleDateString('en-GB'),
      new Date(item.updated_at).toLocaleDateString('en-GB')
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast.success(`Exported ${data.length} records successfully`);
}

export function exportAnalyticsReport(
  requests: RepairRequest[],
  filename: string = 'analytics-report.csv'
) {
  const statusCounts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equipmentCounts = requests.reduce((acc, req) => {
    acc[req.equipment_type] = (acc[req.equipment_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviceTypeCounts = requests.reduce((acc, req) => {
    acc[req.service_type] = (acc[req.service_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const reportContent = [
    'ToolServe Analytics Report',
    `Generated: ${new Date().toLocaleString('en-GB')}`,
    '',
    'SUMMARY',
    `Total Requests: ${requests.length}`,
    `Active Repairs: ${requests.filter(r => r.status === 'diagnosing' || r.status === 'in_repair').length}`,
    `Completed: ${requests.filter(r => r.status === 'completed').length}`,
    '',
    'STATUS BREAKDOWN',
    'Status,Count,Percentage',
    ...Object.entries(statusCounts).map(([status, count]) =>
      `${status},${count},${((count / requests.length) * 100).toFixed(1)}%`
    ),
    '',
    'EQUIPMENT TYPES',
    'Equipment,Count',
    ...Object.entries(equipmentCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type, count]) => `"${type}",${count}`),
    '',
    'SERVICE TYPES',
    'Service Type,Count',
    ...Object.entries(serviceTypeCounts).map(([type, count]) => `${type},${count}`),
  ].join('\n');

  const blob = new Blob([reportContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast.success('Analytics report exported successfully');
}
