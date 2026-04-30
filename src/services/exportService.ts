import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";


export async function exportCSV(
  filename: string,
  rows: { timestamp: string; value: number }[]
) {
  const csvContent =
    "timestamp,density\n" + rows.map(r => `${r.timestamp},${r.value}`).join("\n");

  const fileUri = ((FileSystem as any).documentDirectory ?? '') + "resconi-" + Date.now() + '-' + filename;
  await FileSystem.writeAsStringAsync(fileUri, csvContent);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
  return fileUri;
}

export async function exportPDF(
  filename: string,
  rows: { timestamp: string; value: number }[],
  surveyId: number
) {
  const html = `
    <html>
      <body>
        <h1>Density History Report</h1>
        <p>Survey ID: ${surveyId}</p>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr><th>Timestamp</th><th>Density (trees/m²)</th></tr>
          ${rows.map(r => `<tr><td>${r.timestamp}</td><td>${r.value}</td></tr>`).join("")}
        </table>
      </body>
    </html>
  `;
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }
  return uri;
}
