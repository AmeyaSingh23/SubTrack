// Converts subscription data to a CSV string and triggers a browser download.
// This runs entirely on the client — no server needed.
// CSV (Comma Separated Values) is a plain text format Excel and Google Sheets
// can open directly.

export type ExportableSub = {
  name: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: Date;
  category: string;
  isActive: boolean;
  isTrial: boolean;
  cancelUrl: string | null;
  createdAt: Date;
};

export function exportToCSV(subscriptions: ExportableSub[]) {
  // CSV header row — each column name
  const headers = [
    "Name",
    "Amount",
    "Currency",
    "Billing Cycle",
    "Next Billing Date",
    "Category",
    "Status",
    "Trial",
    "Cancel URL",
    "Added On",
  ];

  const rows = subscriptions.map((sub) => [
    sub.name,
    sub.amount.toString(),
    sub.currency,
    sub.billingCycle,
    new Date(sub.nextBillingDate).toLocaleDateString("en-IN"),
    sub.category,
    sub.isActive ? "Active" : "Cancelled",
    sub.isTrial ? "Yes" : "No",
    sub.cancelUrl ?? "",
    new Date(sub.createdAt).toLocaleDateString("en-IN"),
  ]);

  // Join each row with commas, wrap values with commas in quotes
  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((val) => (val.includes(",") ? `"${val}"` : val)).join(",")
    )
    .join("\n");

  // Create a downloadable blob and trigger the browser's download
  // Blob = Binary Large Object, a raw file in memory
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `subtrack-export-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();

  // Clean up — release the object URL from memory
  URL.revokeObjectURL(url);
}