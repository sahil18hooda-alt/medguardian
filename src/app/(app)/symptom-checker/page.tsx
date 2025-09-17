import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SymptomCheckerForm } from "./symptom-checker-form";
import { Stethoscope } from "lucide-react";

export default function SymptomCheckerPage() {
  return (
    <div className="container mx-auto max-w-5xl">
        <Card className="mb-8 border-0 shadow-none bg-transparent">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="bg-accent p-3 rounded-full">
                        <Stethoscope className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-headline">AI Symptom Analysis</CardTitle>
                        <CardDescription>Enter your symptoms to get potential causes and next steps from our AI assistant.</CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>
        <SymptomCheckerForm />
    </div>
  );
}
