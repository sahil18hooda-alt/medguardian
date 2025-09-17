import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskCalculatorForm } from "./risk-calculator-form";
import { HeartPulse } from "lucide-react";

export default function RiskCalculatorPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <Card className="mb-8 border-0 shadow-none bg-transparent">
          <CardHeader>
              <div className="flex items-center gap-4">
                  <div className="bg-accent p-3 rounded-full">
                      <HeartPulse className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div>
                      <CardTitle className="text-3xl font-headline">Predictive Patient Risk Model</CardTitle>
                      <CardDescription>Calculate a patient's risk score based on their health data.</CardDescription>
                  </div>
              </div>
          </CardHeader>
      </Card>
      <RiskCalculatorForm />
    </div>
  );
}
