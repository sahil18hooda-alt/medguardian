import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XrayAnalyzerForm } from "./xray-analyzer-form";
import { FileScan } from "lucide-react";

export default function XrayAnalyzerPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <Card className="mb-8 border-0 shadow-none bg-transparent">
          <CardHeader>
              <div className="flex items-center gap-4">
                  <div className="bg-accent p-3 rounded-full">
                      <FileScan className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div>
                      <CardTitle className="text-3xl font-headline">AI-Powered X-Ray Analysis</CardTitle>
                      <CardDescription>Upload an X-ray image to get an AI-powered analysis.</CardDescription>
                  </div>
              </div>
          </CardHeader>
      </Card>
      <XrayAnalyzerForm />
    </div>
  );
}
