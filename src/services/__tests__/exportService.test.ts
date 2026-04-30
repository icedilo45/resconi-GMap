import * as FileSystem from "expo-file-system";
import { exportCSV } from "../exportService";

describe("exportService", () => {
  it("creates a CSV file with density history", async () => {
    const rows = [
      { timestamp: "2026-04-28T12:00:00Z", value: 0.01 },
      { timestamp: "2026-04-28T13:00:00Z", value: 0.02 },
    ];

    const fileUri = await exportCSV("test.csv", rows);

    // read back the file
    const content = await FileSystem.readAsStringAsync(fileUri);

    expect(content).toContain("timestamp,density");
    expect(content).toContain("2026-04-28T12:00:00Z,0.01");
    expect(content).toContain("2026-04-28T13:00:00Z,0.02");
  });
});
