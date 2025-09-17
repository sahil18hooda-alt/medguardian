"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, Activity } from "lucide-react";
import { analyzeSymptoms, SymptomAnalysisOutput } from "@/ai/flows/ai-symptom-analysis";
import { useToast } from "@/hooks/use-toast";
import { DoctorList } from "./doctor-list";

const formSchema = z.object({
  symptoms: z.string().min(10, "Please describe your symptoms in more detail."),
  age: z.coerce.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export function SymptomCheckerForm() {
  const [analysisResult, setAnalysisResult] = useState<SymptomAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeSymptoms(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Symptom analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was a problem analyzing your symptoms. Please try again.",
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I have a persistent cough, a high fever, and I feel very tired.'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 34" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender (optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Analyzing..." : "Analyze Symptoms"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing your symptoms...</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
            </CardContent>
        </Card>
      )}

      {analysisResult && (
        <div className="mt-8 grid gap-8">
            <Card className="bg-secondary border-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-secondary-foreground">
                        <Lightbulb className="h-6 w-6" />
                        <span>Potential Causes</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-secondary-foreground">{analysisResult.potentialCauses}</p>
                </CardContent>
            </Card>
            <Card className="bg-accent border-accent">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-accent-foreground">
                        <Activity className="h-6 w-6" />
                        <span>Recommended Next Steps</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-accent-foreground">{analysisResult.recommendedNextSteps}</p>
                </CardContent>
            </Card>

            <DoctorList />
        </div>
      )}
    </>
  );
}
