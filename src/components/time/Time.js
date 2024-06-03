import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function Time() {
  const tasks = JSON.parse(
    localStorage.getItem('tasks')
  );

  const dataMap = new Map();
  tasks.forEach(task => {
    if (dataMap.has(task.endDate)) {
        dataMap.set(task.endDate, dataMap.get(task.endDate) + 1);
    } else {
        dataMap.set(task.endDate, 1);
    }
  });

  let series = [];
  dataMap.forEach((val, key) => {
    series.push({month: key, value: val});
  })

  series.sort((a, b) => a.month < b.month ? -1 : 1);

  return (
    <BarChart
      series={[
        { data: series.map(s => s.value) },
      ]}
      height={500}
      xAxis={[{ data: series.map(s => s.month), scaleType: 'band' }]}
      margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
    />
  );
}