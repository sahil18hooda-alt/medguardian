"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { calculateRiskScore, RiskScoreOutput } from "@/ai/flows/risk-score-calculation";
import { useToast } from "@/hooks/use-toast";
import { RiskScoreChart } from "./risk-score-chart";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  demographics: z.object({
    age: z.coerce.number().min(0, "Age must be a positive number."),
    gender: z.string().min(1, "Gender is required."),
    location: z.string().min(1, "Location is required."),
  }),
  historicalData: z.object({
    previousConditions: z.string().min(1, "Please list at least one condition, or 'None'."),
    hospitalAdmissions: z.coerce.number().min(0, "Admissions cannot be negative."),
  }),
  currentHealthConditions: z.object({
    symptoms: z.string().min(1, "Please list at least one symptom, or 'None'."),
    diagnosis: z.string().min(1, "Diagnosis is required."),
  }),
});

export function RiskCalculatorForm() {
  const [riskResult, setRiskResult] = useState<RiskScoreOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      demographics: { age: undefined, gender: "", location: "" },
      historicalData: { previousConditions: "", hospitalAdmissions: undefined },
      currentHealthConditions: { symptoms: "", diagnosis: "" },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRiskResult(null);

    const processedValues = {
      demographics: values.demographics,
      historicalData: {
        ...values.historicalData,
        previousConditions: values.historicalData.previousConditions.split(',').map(s => s.trim()).filter(Boolean),
      },
      currentHealthConditions: {
        ...values.currentHealthConditions,
        symptoms: values.currentHealthConditions.symptoms.split(',').map(s => s.trim()).filter(Boolean),
      },
    };
    
    try {
      const result = await calculateRiskScore(processedValues);
      setRiskResult(result);
    } catch (error) {
      console.error("Risk score calculation failed:", error);
      toast({
        variant: "destructive",
        title: "Calculation Failed",
        description: "There was a problem calculating the risk score. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4 font-headline">Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="demographics.age" render={({ field }) => (
                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" placeholder="e.g., 58" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="demographics.gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel><FormControl><Input placeholder="e.g., Male" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="demographics.location" render={({ field }) => (
                     <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., New York, USA" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4 font-headline">Historical Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="historicalData.previousConditions" render={({ field }) => (
                        <FormItem><FormLabel>Previous Conditions</FormLabel><FormControl><Input placeholder="e.g., Hypertension, Diabetes" {...field} /></FormControl><FormDescription>Comma-separated list.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="historicalData.hospitalAdmissions" render={({ field }) => (
                        <FormItem><FormLabel># Hospital Admissions</FormLabel><FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4 font-headline">Current Health Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="currentHealthConditions.symptoms" render={({ field }) => (
                        <FormItem><FormLabel>Current Symptoms</FormLabel><FormControl><Input placeholder="e.g., Chest pain, Shortness of breath" {...field} /></FormControl><FormDescription>Comma-separated list.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="currentHealthConditions.diagnosis" render={({ field }) => (
                        <FormItem><FormLabel>Current Diagnosis</FormLabel><FormControl><Input placeholder="e.g., Acute Coronary Syndrome" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Calculating..." : "Calculate Risk Score"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="mt-8">
            <CardContent className="p-6 flex justify-center items-center h-64">
                <div className="text-center space-y-2">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Calculating risk score...</p>
                </div>
            </CardContent>
        </Card>
      )}

      {riskResult && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="font-headline">Risk Score Result</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                    <h4 className="font-semibold text-lg mb-2">Rationale</h4>
                    <p className="text-muted-foreground">{riskResult.rationale}</p>
                </div>
                <div className="order-1 md:order-2">
                    <RiskScoreChart score={riskResult.riskScore} level={riskResult.riskLevel} />
                </div>
            </CardContent>
        </Card>
      )}
    </>
  );
}
