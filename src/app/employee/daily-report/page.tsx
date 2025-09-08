import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyReportForm } from "./daily-report-form";

export default function DailyReportPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Submit Daily Report</CardTitle>
          <CardDescription>
            Enter your sales and expense totals for the day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DailyReportForm />
        </CardContent>
      </Card>
    </div>
  );
}
