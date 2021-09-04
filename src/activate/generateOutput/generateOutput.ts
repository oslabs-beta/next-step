import { AnyNsRecord } from "dns";
import * as vscode from 'vscode';

// Format metricData and display in Output panel
export const generateOutput = (metricData: string, output: vscode.OutputChannel) => {
  // get variables
  const { metrics , logs } = JSON.parse(metricData);

  const metricList = { 
    firstContentfulPaint: 'FCP', 
    cumulativeLayoutShift: 'CLS', 
    largestContentfulPaint: 'LCP', 
    firstInputDelay: 'FID',
    timeToFirstByte: 'TTFB', 
  };
  let metricName: keyof typeof metricList;

  // store metricStore of values by metric
  const metricStore = { 
    firstContentfulPaint: Array(), 
    cumulativeLayoutShift: Array(), 
    largestContentfulPaint: Array(), 
    firstInputDelay: Array(),
    timeToFirstByte: Array(), 
  };

  for (let i = 0; i < logs.length; i++) {
    for(metricName in metricStore) {
      if (logs[i][metricList[metricName]] !== undefined) {metricStore[metricName].push(logs[i][metricList[metricName]])};
    }
  }

  // store average of last five values
  const avgLastFive = {
    firstContentfulPaint: 0, 
    cumulativeLayoutShift: 0, 
    largestContentfulPaint: 0, 
    firstInputDelay: 0, 
    timeToFirstByte: 0,
  };
  
  // calculate average per metric
  console.log(metricStore);
  // TODO: ignore empties
  for (metricName in metricStore) {
    const arr = metricStore[metricName]; 
    const size = arr.length;
    if (size > 0 && size <= 5) {
      avgLastFive[metricName] = arr.reduce((a,c) => a + c, 0)/size;
    }
    let sum = 0;
    for (let i = size - 1; i > size - 6; i--){
      sum += arr[i];
    };
    avgLastFive[metricName] = sum / 5;
  };

  // round values to seconds
  const fcp = metrics.FCP ? (metrics.FCP / 1000).toFixed(2) : 'N/A';
  const cls = metrics.CLS ? metrics.CLS.toFixed(2) : 'N/A';
  const lcp = metrics.LCP ? (metrics.LCP / 1000).toFixed(2) : 'N/A';
  const fid = metrics.FID ? (metrics.FID / 1000).toFixed(2) : 'N/A';
  const ttfb = metrics.TTFB ? (metrics.TTFB / 1000).toFixed(2) : 'N/A';
  
  // compare values to google benchmarks to provide score
  const fcpScore = isNaN(Number(fcp)) ? 'N/A  ⚫️' : Number(fcp) < 1.8 ? 'Good 🟢' : Number(fcp) < 3 ? 'Okay 🟠' : 'Poor 🔴';
  const clsScore = isNaN(Number(cls)) ? 'N/A  ⚫️' : Number(cls) < 0.1 ? 'Good 🟢' : Number(cls) < 0.25 ? 'Okay 🟠' : 'Poor 🔴';
  const lcpScore = isNaN(Number(lcp)) ? 'N/A  ⚫️' : Number(lcp) < 2.5 ? 'Good 🟢' : Number(lcp) < 4 ? 'Okay 🟠' : 'Poor 🔴';
  const fidScore = isNaN(Number(fid)) ? 'N/A  ⚫️' : Number(fid) < 1 ? 'Good 🟢' : Number(fid) < 3 ? 'Okay 🟠' : 'Poor 🔴';
  const ttfbScore = isNaN(Number(ttfb)) ? 'N/A  ⚫️' : Number(ttfb) < 0.6 ? 'Good 🟢' : 'Poor 🔴';
  
  // round average values
  const fcpAvg = avgLastFive.firstContentfulPaint ? (avgLastFive.firstContentfulPaint / 1000).toFixed(2) : 'N/A';
  const clsAvg = avgLastFive.cumulativeLayoutShift ? avgLastFive.cumulativeLayoutShift.toFixed(2) : 'N/A';
  const lcpAvg = avgLastFive.largestContentfulPaint ? (avgLastFive.largestContentfulPaint / 1000).toFixed(2) : 'N/A';
  const fidAvg = avgLastFive.firstInputDelay ? (avgLastFive.firstInputDelay / 1000).toFixed(2) : 'N/A';
  const ttfbAvg = avgLastFive.timeToFirstByte ? (avgLastFive.timeToFirstByte / 1000).toFixed(2) : 'N/A';
  const fcpAvgScore = isNaN(Number(fcpAvg)) ? 'N/A  ⚫️' : Number(fcpAvg) < 1.8 ? 'Good 🟢' : Number(fcpAvg) < 3 ? 'Okay 🟠' : 'Poor 🔴';
  const clsAvgScore = isNaN(Number(clsAvg)) ? 'N/A  ⚫️' : Number(clsAvg) < 0.1 ? 'Good 🟢' : Number(clsAvg) < 0.25 ? 'Okay 🟠' : 'Poor 🔴';
  const lcpAvgScore = isNaN(Number(lcpAvg)) ? 'N/A  ⚫️' : Number(lcpAvg) < 2.5 ? 'Good 🟢' : Number(lcpAvg) < 4 ? 'Okay 🟠' : 'Poor 🔴';
  const fidAvgScore = isNaN(Number(fidAvg)) ? 'N/A  ⚫️' : Number(fidAvg) < 1 ? 'Good 🟢' : Number(fidAvg) < 3 ? 'Okay 🟠' : 'Poor 🔴';
  const ttfbAvgScore = isNaN(Number(ttfbAvg)) ? 'N/A  ⚫️' : Number(ttfbAvg) < 0.6 ? 'Good 🟢' : 'Poor 🔴';

  // links for more details on each metric
  const fcpLink = 'https://web.dev/fcp/ ';
  const clsLink = 'https://web.dev/cls/ ';
  const lcpLink = 'https://web.dev/lcp/ ';
  const fidLink = 'https://web.dev/fid/ ';
  const ttfbLink = 'https://web.dev/time-to-first-byte/ ';
  const helpFixScore = `Want to improve "poor" areas?: ${fcpScore === 'Poor 🔴' ? fcpLink : ""}${clsScore === 'Poor 🔴' ? clsLink : ""}${fidScore === 'Poor 🔴' ? fidLink : ""}${lcpScore === 'Poor 🔴' ? lcpLink : ""}${ttfbScore === 'Poor 🔴' ? ttfbLink : ""}`;   
  
  // format table of output panel
  const metricOutput = `--------------------------------------------
  Metric | Value           | Average (Last 5)
  --------------------------------------------
  FCP:   | ${fcp + 's'}${' '.repeat(5 - fcp.length)} ${fcpScore}  | ${fcpAvg} ${fcpAvgScore}
  CLS:   | ${cls}${' '.repeat(6 - cls.length)} ${clsScore}  | ${clsAvg} ${clsAvgScore}
  LCP:   | ${lcp + 's'}${' '.repeat(5 - lcp.length)} ${lcpScore}  | ${lcpAvg} ${lcpAvgScore}
  FID:   | ${fid + 's'}${' '.repeat(5 - fid.length)} ${fidScore}  | ${fidAvg} ${fidAvgScore}
  TTFB:  | ${ttfb + 's'}${' '.repeat(5 - ttfb.length)} ${ttfbScore}  | ${ttfbAvg} ${ttfbAvgScore}
  --------------------------------------------\n`;

  // display in output panel
  output.clear();
  output.show();
  output.appendLine('testing');
  output.appendLine(metricOutput);
  output.appendLine(helpFixScore);

};