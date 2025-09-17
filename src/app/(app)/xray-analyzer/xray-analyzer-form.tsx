'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { xrayAnalysis, XrayAnalysisOutput } from '@/ai/flows/xray-analysis';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  image: z.any().refine(file => file?.length == 1, 'X-ray image is required.'),
});

export function XrayAnalyzerForm() {
  const [analysisResult, setAnalysisResult] = useState<XrayAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const toDataURL = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const dataUrl = await toDataURL(values.image[0]);
      const result = await xrayAnalysis({ image: dataUrl });
      setAnalysisResult(result);
    } catch (error) {
      console.error("X-ray analysis failed:", error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was a problem analyzing the X-ray. Please try again.',
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
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>X-Ray Image</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={e => onChange(e.target.files)} {...rest} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Analyze X-Ray'}
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
                    <p className="text-muted-foreground">Analyzing X-ray...</p>
                </div>
            </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-headline">Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">Summary</h4>
                <p className="text-muted-foreground">{analysisResult.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Conditions</h4>
                <ul className="space-y-2">
                  {analysisResult.analysis.map((condition, index) => (
                    <li key={index} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                      <span>{condition.condition}</span>
                      <span className="font-mono text-sm font-semibold">{(condition.probability * 100).toFixed(2)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
