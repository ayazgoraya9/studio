import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyReportForm } from "./daily-report-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DailyReportPage() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
       <Button variant="outline" asChild>
        <Link href="/employee">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
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
