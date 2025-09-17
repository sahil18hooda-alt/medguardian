import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceRecorder } from "./voice-recorder";
import { Mic } from "lucide-react";

export default function TranscriptionPage() {
  return (
    <div className="container mx-auto max-w-5xl">
       <Card className="mb-8 border-0 shadow-none bg-transparent">
          <CardHeader>
              <div className="flex items-center gap-4">
                  <div className="bg-accent p-3 rounded-full">
                      <Mic className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div>
                      <CardTitle className="text-3xl font-headline">Automated Clinical Documentation</CardTitle>
                      <CardDescription>Use your voice to automatically generate accurate clinical notes.</CardDescription>
                  </div>
              </div>
          </CardHeader>
      </Card>
      <VoiceRecorder />
    </div>
  );
}
